const { Sequelize, Op } = require('sequelize');
const { t } = require('i18next');

const models = require('../../../models/index');
const response = require('../../../helpers/response.helper');
const FilePath = require('../../../config/upload.config');
const { getFileUrl } = require('../../../helpers/s3file.helper');
const PaginationLength = require('../../../config/pagination.config');
const {
  createOneTimePayment,
  createRefundPayment,
} = require('../../../helpers/payment.helper');
const emailHelper = require('../../../helpers/email.helper');
const { translationTextMessage } = require('../../../helpers/common.helper');
const { storeNotification } = require('../../../helpers/notification.helper');
const { encryptionKey } = require('../../../helpers/dosespot.helper');
const {
  CreatePrescription,
  CreateFillRequest,
  GetPrescription,
  GetFillRequest,
} = require('../../../helpers/transitionrx.helper');

class OrderController {
  constructor() {
    this.placeOrderPharmacy = this.placeOrderPharmacy.bind(this);
    this.OrderPlaceFillRequest = this.OrderPlaceFillRequest.bind(this);
    this.OrderItemRxStatusChange = this.OrderItemRxStatusChange.bind(this);
  }

  /**
   * @name OrderStatusChange
   * @description orderItem To Update Order Status.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async OrderStatusChange(order_id, status) {
    const getOrderData = await models.Orders.findOne({
      where: { order_id },
    });
    const getOrderAllItems = await models.OrderItems.findAll({
      where: { order_id },
    });
    let is_valid = false;
    const getRxAcceptItems = getOrderAllItems.filter((v) => v.rx_status === 2);
    const rxAcceptCount = getRxAcceptItems.length;
    const rxRejectCount = getOrderAllItems.filter((v) =>
      [3, 4, 5].includes(v.rx_status)
    ).length;
    const getRxPendingItems = getOrderAllItems.filter(
      (v) => v.rx_status === 1
    ).length;
    const pendingPre = getRxAcceptItems.filter(
      (v) => v.pre_status === null
    ).length;
    const getPreShippedItems = getRxAcceptItems.filter(
      (v) => v.pre_status === 4
    ).length;
    const getShippedItems = getRxAcceptItems.filter(
      (v) => v.transitionrx_fill_status === 3
    ).length;
    if (getOrderAllItems.length === 1) {
      is_valid = true;
    } else if (rxAcceptCount >= 1 && getRxPendingItems < 1) {
      if (parseInt(status, 10) === 6) {
        status = 3;
      }
      if (pendingPre >= 1) {
        status = 3;
      }
      if (getPreShippedItems >= 1 && pendingPre < 1 && getShippedItems < 1) {
        status = 4;
      }
      if (getShippedItems >= 1 && getPreShippedItems < 1) {
        status = 5;
      }
      is_valid = true;
    } else if (rxRejectCount >= 1 && getRxPendingItems < 1) {
      status = 6;
      is_valid = true;
    }
    if (is_valid) {
      getOrderData.order_status = status;
      await getOrderData.save();
      await models.OrderStatusHistory.create({
        order_id,
        status,
      });
    }
  }

  /**
   * @name preStatusChangeSendData
   * @description Prescription status changes time send notificationtion and mail.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async preStatusChangeSendData(
    orderItemData,
    status,
    user_chat_room_id,
    email,
    org_email
  ) {
    const msgObj = {
      ORDERID: orderItemData.order_id,
      PRICE: orderItemData.sub_total,
      ITEMNAME: orderItemData.formulary.name,
      STATUS: status,
    };
    const rgxString = new RegExp(Object.keys(msgObj).join('|'), 'gi');
    const message = await translationTextMessage(
      'admin.org_pre_status_chat_message_text'
    ).replace(rgxString, (matched) => msgObj[matched]);
    const title = await translationTextMessage(
      'admin.org_pre_status_chat_message_title'
    );
    await models.UserChat.create({
      message: message || null,
      type_message: 7,
      user_chat_room_id,
      from_user_id: orderItemData.organization_id,
      is_seen: 1,
      to_user_id: orderItemData.user_id,
    });
    await emailHelper.organizationSendEmail({
      to: email,
      organization_id: orderItemData.organization_id,
      template: 'telepath-prescription-status-change',
      replacements: {
        ORDER_ID: orderItemData.order_id,
        ORDER_ITEM_NAME: orderItemData.formulary.name,
        AMOUNT: orderItemData.sub_total,
        STATUS: status,
      },
    });
    await emailHelper.sendEmail({
      to: org_email,
      template: 'telepath-prescription-status-change',
      replacements: {
        ORDER_ID: orderItemData.order_id,
        ORDER_ITEM_NAME: orderItemData.formulary.name,
        AMOUNT: orderItemData.sub_total,
        STATUS: status,
      },
    });
    await storeNotification(title, message, orderItemData.user_id);
    await storeNotification(title, message, orderItemData.organization_id);
  }

  /**
   * @name fillStatusChangeSendData
   * @description Fill status changes time send notificationtion and mail.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async fillStatusChangeSendData(
    orderItemData,
    status,
    user_chat_room_id,
    email,
    org_email
  ) {
    const msgObj = {
      ORDERID: orderItemData.order_id,
      PRICE: orderItemData.sub_total,
      ITEMNAME: orderItemData.formulary.name,
      STATUS: status,
    };
    const rgxString = new RegExp(Object.keys(msgObj).join('|'), 'gi');
    const message = await translationTextMessage(
      'admin.org_fill_status_chat_message_text'
    ).replace(rgxString, (matched) => msgObj[matched]);
    const title = await translationTextMessage(
      'admin.org_fill_status_chat_message_title'
    );
    await models.UserChat.create({
      message: message || null,
      type_message: 8,
      user_chat_room_id,
      from_user_id: orderItemData.organization_id,
      is_seen: 1,
      to_user_id: orderItemData.user_id,
    });
    await emailHelper.organizationSendEmail({
      to: email,
      organization_id: orderItemData.organization_id,
      template: 'telepath-fill-status-change',
      replacements: {
        ORDER_ID: orderItemData.order_id,
        ORDER_ITEM_NAME: orderItemData.formulary.name,
        AMOUNT: orderItemData.sub_total,
        STATUS: status,
      },
    });
    await emailHelper.sendEmail({
      to: org_email,
      template: 'telepath-fill-status-change',
      replacements: {
        ORDER_ID: orderItemData.order_id,
        ORDER_ITEM_NAME: orderItemData.formulary.name,
        AMOUNT: orderItemData.sub_total,
        STATUS: status,
      },
    });
    await storeNotification(title, message, orderItemData.user_id);
  }

  /**
   * @name getPatientAllOrderDetails
   * @description Get All patient Order Data.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getPatientAllOrderDetails(req, res) {
    try {
      const { page, serach_text, from_date, to_date, order_status } = req.query;
      const { user_id } = req.payload.user;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const condition = [];
      const wherecondition = [];
      if (serach_text) {
        wherecondition.push({
          name: {
            [Op.like]: `%${serach_text}%`,
          },
        });
        condition.push({
          order_id: {
            [Op.in]: [
              Sequelize.literal(`(
                SELECT OrderItems.order_id FROM order_items as OrderItems WHERE OrderItems.formulary_id IN(SELECT Formularies.formulary_id FROM formulary AS Formularies WHERE Formularies.name LIKE "%${serach_text}%")
            )`),
            ],
          },
        });
      }

      condition.push({
        user_id,
      });
      if (order_status) {
        condition.push({ order_status });
      }
      condition.push({ order_status: { [Op.ne]: 1 } });

      if (from_date) {
        const start_date_time = `${from_date}T00:00:00.000Z`;
        condition.push({
          created_at: {
            [Op.gte]: start_date_time,
          },
        });
      }
      if (to_date) {
        const end_date_time = `${to_date}T23:59:00.000Z`;
        condition.push({
          created_at: {
            [Op.lte]: end_date_time,
          },
        });
      }
      const { docs, pages, total } = await models.Orders.paginate({
        where: condition,
        attributes: [
          'order_id',
          'total_amount',
          'created_at',
          'order_status',
          'payout_status',
        ],
        order: [
          ['order_status', 'ASC'],
          ['order_id', 'DESC'],
        ],
        include: [
          {
            model: models.OrderItems,
            as: 'order_items',
            attributes: [
              'qty',
              'order_item_id',
              'sub_total',
              'formulary_id',
              'transitionrx_prescription_id',
              'transitionrx_patient_id',
              'transitionrx_fill_id',
              'pre_status',
              'transitionrx_fill_status',
              'tracking_number',
              'shipped_date',
              'rx_status',
              'appointment_status',
            ],
            include: [
              {
                model: models.Formulary,
                as: 'formulary',
                where: wherecondition,
                require: true,
                attributes: [
                  'name',
                  'featured_image',
                  'short_description',
                  'formulary_id',
                ],
              },
              {
                model: models.Bookings,
                as: 'bookings',
                order: [['bookings_id', 'DESC']],
              },
            ],
          },
          {
            model: models.OrderAddress,
            as: 'order_addresses',
            attributes: ['user_id', 'first_name', 'last_name'],
          },
          {
            model: models.OrderStatusHistory,
            as: 'order_status_histories',
            attributes: ['created_at'],
          },
        ],
        page,
        paginate: PaginationLength.getAllOrders(),
      });
      const dataList = [];
      await Promise.all(
        docs.map(async (value, index) => {
          const countIntakeQuestionData = await models.Questions.scope(
            'defaultScope',
            'intakeUserQuestionColumns'
          ).findAll({
            order: [['question_id', 'ASC']],
            where: {
              is_required: 1,
              user_id: organizationData.user_id,
            },
          });
          const countUserQuestionIntakeData =
            await models.UserQuestionAns.count({
              where: {
                user_id,
                order_id: value.order_id,
                question_id: {
                  [Op.in]: countIntakeQuestionData.map(
                    (val) => val.question_id
                  ),
                },
              },
            });
          const data = value.dataValues;
          data.order_items = value.order_items;
          data.order_status_histories = value.order_status_histories;
          data.order_addresses = value.order_addresses;
          data.is_intake_question_fill =
            countUserQuestionIntakeData <= countIntakeQuestionData.length &&
            countUserQuestionIntakeData !== 0
              ? 1
              : 2;
          data.intake_question_count = countIntakeQuestionData.length;
          data.user_intake_question_count = countUserQuestionIntakeData;
          await Promise.all(
            data.order_items.map(async (item) => {
              const countQuestionData = await models.Questions.scope(
                'defaultScope',
                'patientformulryUserQuestionColumns'
              ).findAll({
                order: [['question_id', 'ASC']],
                where: {
                  is_required: 1,
                  formulary_id: item.formulary_id,
                  user_id: organizationData.user_id,
                },
              });
              const countUserQuestionData = await models.UserQuestionAns.count({
                where: {
                  user_id,
                  order_id: value.order_id,
                  question_id: {
                    [Op.in]: countQuestionData.map((val) => val.question_id),
                  },
                },
              });
              const returnData = item.dataValues;
              returnData.formulary = item.formulary.dataValues;
              returnData.formulary.featured_image =
                await item.formulary.featured_image.then((dataUrl) => dataUrl);
              returnData.is_question_fill =
                countUserQuestionData <= countQuestionData.length &&
                countUserQuestionData !== 0
                  ? 1
                  : 2;
              returnData.question_count = countQuestionData.length;
              returnData.use_question_count = countUserQuestionData;
              return returnData;
            })
          );
          dataList[index] = data;
          return value;
        })
      );
      return response.successResponse(
        req,
        res,
        'admin.get_patient_all_order_transaction_success',
        {
          pagination: {
            total,
            count: docs.length,
            current_page: page,
            last_page: pages,
            per_page: PaginationLength.getAllOrders(),
            hasMorePages: pages > parseInt(page, 10),
          },
          order_list: dataList,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientMedicalIntakeDetails
   * @description Get patient Formulary Intake Details.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getPatientMedicalIntakeDetails(req, res) {
    try {
      const { formulary_id, order_id } = req.query;
      const { user_id } = req.payload.user;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const questionData = await models.Questions.scope(
        'defaultScope',
        'patientformulryUserQuestionColumns'
      ).findAll({
        where: { formulary_id, user_id: organizationData.user_id },
        order: [['question_id', 'ASC']],
        include: [
          {
            model: models.QuestionOptions,
            as: 'question_options',
            include: [
              {
                model: models.UserQuestionAnsOption,
                as: 'user_question_ans_option',
                where: { order_id, user_id },
                required: false,
              },
            ],
          },
          {
            model: models.UserQuestionAns,
            as: 'user_question_ans',
            where: { order_id, user_id },
            required: false,
          },
        ],
      });
      const geFormulartQuestionsData = [];
      questionData.map(async (value, index) => {
        let ans_type = 1;
        let ans_value =
          value.user_question_ans !== null
            ? value.user_question_ans.ans_value
            : '';
        if (value.question_type === 6 && value.user_question_ans !== null) {
          let folder_path = '';
          const fileFolderPath = FilePath.getFolderConfig().ans_value_image;
          folder_path = fileFolderPath.file_path.replace(
            fileFolderPath.replace,
            value.user_question_ans.user_question_ans_id
          );
          folder_path += ans_value;

          ans_value = await getFileUrl(folder_path).then((dataUrl) => dataUrl);
          ans_type = 3;
        } else if (value.question_type === 7) {
          ans_type = 4;
        } else if ([3, 4, 5].includes(value.question_type)) {
          ans_type = 2;
        }
        geFormulartQuestionsData[index] = {
          user_question_ans_id:
            value.user_question_ans !== null
              ? value.user_question_ans.user_question_ans_id
              : 0,
          question_type: value.question_type,
          question_id: value.question_id,
          ans_value,
          ans_type,
          label: value.label,
          is_required: value.is_required,
          question_text:
            value.user_question_ans !== null
              ? value.user_question_ans.question_text
              : '',
          is_delete: 1,
          is_new: 1,
          user_question_ans_option: value.question_options.map((item) => ({
            user_question_ans_option_id:
              item.user_question_ans_option !== null
                ? item.user_question_ans_option.user_question_ans_option_id
                : 0,
            is_delete: 1,
            is_new: item.user_question_ans_option !== null ? 2 : 1,
            question_option_id: item.question_option_id,
            option_value: item.option_value,
          })),
        };
      });

      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.get_medical_intake_success',
          geFormulartQuestionsData
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientGeneralIntakeDetails
   * @description Get patient Checkout General Intake Details.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getPatientGeneralIntakeDetails(req, res) {
    try {
      const { order_id } = req.query;
      const { user_id } = req.payload.user;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const questionData = await models.Questions.scope(
        'defaultScope',
        'intakeUserQuestionColumns'
      ).findAll({
        order: [['question_id', 'ASC']],
        where: { user_id: organizationData.user_id },
        include: [
          {
            model: models.QuestionOptions,
            as: 'question_options',
            include: [
              {
                model: models.UserQuestionAnsOption,
                as: 'user_question_ans_option',
                where: { order_id, user_id },
                required: false,
              },
            ],
          },
          {
            model: models.UserQuestionAns,
            as: 'user_question_ans',
            where: { order_id, user_id },
            required: false,
          },
        ],
      });
      const orderDetails = await models.Orders.findOne({
        attributes: ['order_id', 'document_id', 'selfi_image'],
        where: {
          order_id,
        },
      });
      const getGeneralIntakeQuestionsData = [];
      questionData.map(async (value, index) => {
        let ans_type = 1;
        let ans_value =
          value.user_question_ans !== null
            ? value.user_question_ans.ans_value
            : '';
        if (value.question_type === 6 && value.user_question_ans !== null) {
          let folder_path = '';
          const fileFolderPath = FilePath.getFolderConfig().ans_value_image;
          folder_path = fileFolderPath.file_path.replace(
            fileFolderPath.replace,
            value.user_question_ans.user_question_ans_id
          );
          folder_path += ans_value;

          ans_value = await getFileUrl(folder_path).then((dataUrl) => dataUrl);
          ans_type = 3;
        } else if (value.question_type === 7) {
          ans_type = 4;
        } else if ([3, 4, 5].includes(value.question_type)) {
          ans_type = 2;
        }
        getGeneralIntakeQuestionsData[index] = {
          user_question_ans_id:
            value.user_question_ans !== null
              ? value.user_question_ans.user_question_ans_id
              : 0,
          question_type: value.question_type,
          question_id: value.question_id,
          ans_value,
          ans_type,
          label: value.label,
          is_required: value.is_required,
          question_text:
            value.user_question_ans !== null
              ? value.user_question_ans.question_text
              : '',
          is_delete: 1,
          is_new: 1,
          user_question_ans_option: value.question_options.map((item) => ({
            user_question_ans_option_id:
              item.user_question_ans_option !== null
                ? item.user_question_ans_option.user_question_ans_option_id
                : 0,
            is_delete: 1,
            is_new: item.user_question_ans_option !== null ? 2 : 1,
            question_option_id: item.question_option_id,
            option_value: item.option_value,
          })),
        };
      });
      if (orderDetails) {
        const data = orderDetails.dataValues;
        data.document_id = await orderDetails.document_id.then(
          (dataUrl) => dataUrl
        );
        data.selfi_image = await orderDetails.selfi_image.then(
          (dataUrl) => dataUrl
        );
        getGeneralIntakeQuestionsData.push(data);
      }

      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.get_general_intake_success',
          getGeneralIntakeQuestionsData
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientOrderDetails
   * @description Get Order Formulary List Data.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getPatientOrderDetails(req, res) {
    try {
      const { user_id } = req.payload.user;
      const { order_id } = req.query;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const getOrderData = await models.Orders.findOne({
        where: {
          user_id,
          order_id,
          organization_id: organizationData.user_id,
        },
        attributes: [
          'order_id',
          'user_id',
          'total_amount',
          'packing_shipping_fee',
          'doctor_visit_fee',
          'medication_cost',
          'telemedicine_platform_fee',
          'selfi_image',
          'created_at',
          'order_note',
          'order_status',
          'payout_status',
        ],
        include: [
          {
            model: models.UserCards,
            as: 'user_cards',
            require: false,
            paranoid: false,
          },
          {
            model: models.OrderItems,
            as: 'order_items',
            attributes: [
              'formulary_id',
              'qty',
              'sub_total',
              'order_item_id',
              'transitionrx_prescription_id',
              'transitionrx_patient_id',
              'transitionrx_fill_id',
              'pre_status',
              'transitionrx_fill_status',
              'tracking_number',
              'shipped_date',
              'rx_status',
              'appointment_status',
            ],
            include: [
              {
                model: models.Formulary,
                as: 'formulary',
                attributes: [
                  'formulary_id',
                  'name',
                  'featured_image',
                  'short_description',
                ],
              },
            ],
          },
          {
            model: models.OrderAddress,
            as: 'order_addresses',
            attributes: [
              'order_address_id',
              'first_name',
              'last_name',
              'phone',
              'address',
              'city',
              'state_id',
              'zipcode',
              'type',
              [
                Sequelize.literal(`(
                SELECT name
                FROM states AS states_table
                WHERE ( states_table.state_id = order_addresses.state_id)
            )`),
                'statename',
              ],
            ],
          },
          {
            model: models.Users,
            as: 'users',
            attributes: ['user_id'],
            include: [
              {
                model: models.UserCards,
                as: 'user_cards',
                attributes: ['type', 'card_last_digit'],
                where: { user_id },
              },
            ],
          },
        ],
      });
      let data = {};
      if (getOrderData) {
        const countIntakeQuestionData = await models.Questions.scope(
          'defaultScope',
          'intakeUserQuestionColumns'
        ).findAll({
          order: [['question_id', 'ASC']],
          where: {
            is_required: 1,
            user_id: organizationData.user_id,
          },
        });
        const countUserQuestionIntakeData = await models.UserQuestionAns.count({
          where: {
            user_id,
            order_id,
            question_id: {
              [Op.in]: countIntakeQuestionData.map((val) => val.question_id),
            },
          },
        });

        data = getOrderData.dataValues;
        data.order_id = getOrderData.order_id;
        data.user_id = getOrderData.user_id;
        data.total_amount = getOrderData.total_amount;
        data.created_at = getOrderData.created_at;
        data.order_status = getOrderData.order_status;
        data.payout_status = getOrderData.payout_status;
        data.user_cards = getOrderData.user_cards;
        data.selfi_image = await getOrderData.selfi_image.then(
          (dataUrl) => dataUrl
        );
        await Promise.all(
          data.order_items.map(async (item) => {
            const countQuestionData = await models.Questions.scope(
              'defaultScope',
              'patientformulryUserQuestionColumns'
            ).findAll({
              order: [['question_id', 'ASC']],
              where: {
                is_required: 1,
                formulary_id: item.formulary_id,
                user_id: organizationData.user_id,
              },
            });
            const countUserQuestionData = await models.UserQuestionAns.count({
              where: {
                user_id,
                order_id,
                question_id: {
                  [Op.in]: countQuestionData.map((val) => val.question_id),
                },
              },
            });
            const appointmentData = await models.Bookings.findOne({
              where: {
                order_id,
                order_item_id: item.order_item_id,
                booking_status: {
                  [Op.not]: 8,
                },
              },
              order: [['bookings_id', 'DESC']],
            });
            const returnData = item.dataValues;
            returnData.formulary = item.formulary.dataValues;
            returnData.is_question_fill =
              countUserQuestionData <= countQuestionData.length &&
              countUserQuestionData !== 0
                ? 1
                : 2;
            returnData.question_count = countQuestionData.length;
            returnData.use_question_count = countUserQuestionData;
            returnData.formulary.featured_image =
              await item.formulary.featured_image.then((dataUrl) => dataUrl);
            returnData.bookings = appointmentData;
            return returnData;
          })
        );
        data.is_intake_question_fill =
          countUserQuestionIntakeData <= countIntakeQuestionData.length &&
          countUserQuestionIntakeData !== 0
            ? 1
            : 2;
        data.intake_question_count = countIntakeQuestionData.length;
        data.user_intake_question_count = countUserQuestionIntakeData;
      }
      return response.successResponse(
        req,
        res,
        'admin.get_order_product_success',
        data
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationAllOrderList
   * @description Get All Organization Order Data.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getOrganizationAllOrderList(req, res) {
    try {
      const { page, serach_text, from_date, to_date, order_status } = req.query;
      const { organization_id } = req.payload.user;
      const condition = [];
      const wherecondition = [];
      if (serach_text) {
        wherecondition.push({
          name: {
            [Op.like]: `%${serach_text}%`,
          },
        });
      }
      condition.push({
        order_id: {
          [Op.in]: [
            Sequelize.literal(`(
              SELECT OrderItems.order_id FROM order_items as OrderItems WHERE OrderItems.formulary_id IN(SELECT Formularies.formulary_id FROM formulary AS Formularies WHERE Formularies.name LIKE "%${serach_text}%")
          )`),
          ],
        },
      });

      condition.push({
        organization_id,
      });
      if (order_status) {
        condition.push({ order_status });
      }
      condition.push({ order_status: { [Op.ne]: 1 } });

      if (from_date) {
        const start_date_time = `${from_date}T00:00:00.000Z`;
        condition.push({
          created_at: {
            [Op.gte]: start_date_time,
          },
        });
      }
      if (to_date) {
        const end_date_time = `${to_date}T23:59:00.000Z`;
        condition.push({
          created_at: {
            [Op.lte]: end_date_time,
          },
        });
      }
      const { docs, pages, total } = await models.Orders.paginate({
        where: condition,
        attributes: [
          'order_id',
          'organization_id',
          'user_id',
          'total_amount',
          'created_at',
          'card_id',
          'order_status',
          'payout_status',
          [
            Sequelize.literal(`(
              SELECT user_chat_room_id
              FROM user_chat_room AS user_chat_room_table
              WHERE ( user_chat_room_table.user_id = Orders.user_id AND user_chat_room_table.organization_id = Orders.organization_id ) ORDER by user_chat_room_id ASC LIMIT 1
          )`),
            'user_chat_room_id',
          ],
        ],
        order: [
          ['order_status', 'ASC'],
          ['order_id', 'DESC'],
        ],
        include: [
          {
            model: models.OrderItems,
            as: 'order_items',
            attributes: [
              'qty',
              'sub_total',
              'formulary_id',
              'order_item_id',
              'transitionrx_prescription_id',
              'transitionrx_patient_id',
              'transitionrx_fill_id',
              'pre_status',
              'transitionrx_fill_status',
              'tracking_number',
              'shipped_date',
              'rx_status',
              'appointment_status',
            ],
            include: [
              {
                model: models.Formulary,
                as: 'formulary',
                where: wherecondition,
                required: true,
                attributes: [
                  'name',
                  'featured_image',
                  'short_description',
                  'formulary_id',
                  'is_appointment_required',
                ],
              },
              {
                model: models.Bookings,
                as: 'bookings',
                order: [['bookings_id', 'DESC']],
              },
            ],
          },
          {
            model: models.Users,
            as: 'users',
            attributes: ['user_id', 'first_name', 'last_name', 'phone'],
            include: [
              {
                model: models.PatientInfo,
                as: 'patient_info',
                attributes: ['user_id', 'dosespot_patient_id'],
              },
            ],
          },
          {
            model: models.OrderStatusHistory,
            as: 'order_status_histories',
            attributes: ['created_at'],
          },
        ],
        page,
        paginate: PaginationLength.getAllOrders(),
      });
      const dataList = [];
      await Promise.all(
        docs.map(async (value, index) => {
          const countIntakeQuestionData = await models.Questions.scope(
            'defaultScope',
            'intakeUserQuestionColumns'
          ).findAll({
            order: [['question_id', 'ASC']],
            where: {
              is_required: 1,
              user_id: {
                [Op.in]: [value.organization_id],
              },
            },
          });
          const countUserQuestionIntakeData =
            await models.UserQuestionAns.count({
              where: {
                user_id: {
                  [Op.in]: [value.user_id],
                },
                order_id: value.order_id,
                question_id: {
                  [Op.in]: countIntakeQuestionData.map(
                    (val) => val.question_id
                  ),
                },
              },
            });
          const data = value.dataValues;
          data.order_items = value.order_items;
          data.order_status = value.order_status;
          data.payout_status = value.payout_status;
          data.order_status_histories = value.order_status_histories;
          data.order_addresses = value.order_addresses;
          data.is_intake_question_fill =
            countUserQuestionIntakeData <= countIntakeQuestionData.length &&
            countUserQuestionIntakeData !== 0
              ? 1
              : 2;
          data.intake_question_count = countIntakeQuestionData.length;
          data.user_intake_question_count = countUserQuestionIntakeData;
          await Promise.all(
            data.order_items.map(async (item) => {
              const countQuestionData = await models.Questions.scope(
                'defaultScope',
                'patientformulryUserQuestionColumns'
              ).findAll({
                order: [['question_id', 'ASC']],
                where: {
                  is_required: 1,
                  formulary_id: item.formulary_id,
                  user_id: {
                    [Op.in]: [value.organization_id],
                  },
                },
              });
              const countUserQuestionData = await models.UserQuestionAns.count({
                where: {
                  user_id: {
                    [Op.in]: [value.user_id],
                  },
                  order_id: value.order_id,
                  question_id: {
                    [Op.in]: countQuestionData.map((val) => val.question_id),
                  },
                },
              });
              const returnData = item.dataValues;
              returnData.formulary = item.formulary.dataValues;
              returnData.formulary.featured_image =
                await item.formulary.featured_image.then((dataUrl) => dataUrl);
              returnData.is_question_fill =
                countUserQuestionData <= countQuestionData.length &&
                countUserQuestionData !== 0
                  ? 1
                  : 2;
              returnData.question_count = countQuestionData.length;
              returnData.use_question_count = countUserQuestionData;
              return returnData;
            })
          );
          dataList[index] = data;
          return value;
        })
      );
      let dosespote_data = {};
      const organizationData = await models.Users.findOne({
        where: {
          user_id: organization_id,
        },
        include: [
          {
            model: models.OrganizationInfo,
            as: 'organization_info',
          },
        ],
      });
      if (organizationData.organization_info.dosespot_org_id) {
        dosespote_data = encryptionKey(
          organizationData.organization_info.dosespot_org_id
        );
      }
      return response.successResponse(
        req,
        res,
        'admin.get_organization_all_order_transaction_success',
        {
          pagination: {
            total,
            count: docs.length,
            current_page: page,
            last_page: pages,
            per_page: PaginationLength.getAllOrders(),
            hasMorePages: pages > parseInt(page, 10),
          },
          order_list: dataList,
          dosespote_data,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name storeOrganizationOrderNote
   * @description Store Organization Order Note Details.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async storeOrganizationOrderNote(req, res) {
    try {
      const { organization_id } = req.payload.user;
      const { order_id, note, patient_id } = req.body;
      await models.OrderNotes.create({
        order_id,
        note,
        user_id: patient_id,
        organization_id,
      });
      return response.successResponse(
        req,
        res,
        'admin.organization_note_store_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationOrderNote
   * @description Get Organization Order Note Details.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getOrganizationOrderNote(req, res) {
    try {
      const { order_id } = req.query;
      const orderNoteDetails = await models.OrderNotes.findAll({
        where: {
          order_id,
        },
        attributes: ['order_note_id', 'order_id', 'note', 'created_at'],
        order: [['order_note_id', 'DESC']],
      });
      return response.successResponse(
        req,
        res,
        'admin.organization_note_get_success',
        orderNoteDetails
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name deleteOrganizationOrderNote
   * @description Delete Organization Order Note Details.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async deleteOrganizationOrderNote(req, res) {
    try {
      const { order_note_id } = req.query;
      await models.OrderNotes.destroy({
        where: {
          order_note_id,
        },
      });
      return response.successResponse(
        req,
        res,
        'admin.organization_note_delete_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationTransactionList
   * @description Get Organization Transaction List.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getOrganizationTransactionList(req, res) {
    try {
      const { order_id } = req.query;
      const { organization_id } = req.payload.user;
      const transactionData = await models.UserTransactions.findAll({
        where: {
          order_id,
          organization_id,
          payment_status: 1,
        },
        attributes: [
          'transaction_id',
          'user_transaction_id',
          'user_id',
          'order_id',
          'order_item_id',
          'type',
          'payment_status',
          'amount',
          'user_card_id',
          'created_at',
        ],
        order: [['user_transaction_id', 'DESC']],
        include: [
          {
            model: models.OrderItems,
            as: 'order_items',
            required: false,
            where: {
              order_id,
              organization_id,
            },
            attributes: ['order_item_id', 'order_id', 'formulary_id'],
            include: [
              {
                model: models.Formulary,
                as: 'formulary',
                required: false,
                attributes: ['name'],
              },
            ],
          },
          {
            model: models.UserCards,
            as: 'user_cards',
            attributes: ['user_card_id', 'type', 'card_last_digit'],
            paranoid: false,
          },
        ],
      });
      return response.successResponse(
        req,
        res,
        'admin.order_transaction_get_success',
        transactionData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationOrderDetails
   * @description Get Order Formulary List Data.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getOrganizationOrderDetails(req, res) {
    try {
      const { organization_id } = req.payload.user;
      const { order_id } = req.query;
      const getOrderData = await models.Orders.findOne({
        where: {
          order_id,
          organization_id,
        },
        attributes: [
          'order_id',
          'organization_id',
          'user_id',
          'total_amount',
          'order_note',
          'created_at',
          'order_status',
          'payout_status',
          'packing_shipping_fee',
          'doctor_visit_fee',
          'medication_cost',
          'telemedicine_platform_fee',
          [
            Sequelize.literal(`(
              SELECT user_chat_room_id
              FROM user_chat_room AS user_chat_room_table
              WHERE ( user_chat_room_table.user_id = Orders.user_id AND user_chat_room_table.organization_id = Orders.organization_id ) ORDER by user_chat_room_id ASC LIMIT 1
          )`),
            'user_chat_room_id',
          ],
        ],
        include: [
          {
            model: models.UserCards,
            as: 'user_cards',
            require: false,
            paranoid: false,
          },
          {
            model: models.OrderItems,
            as: 'order_items',
            attributes: [
              'formulary_id',
              'organization_id',
              'qty',
              'sub_total',
              'order_item_id',
              'rx_status',
              'transitionrx_prescription_id',
              'transitionrx_fill_id',
              'transitionrx_patient_id',
              'pre_status',
              'transitionrx_fill_status',
              'tracking_number',
              'shipped_date',
              'appointment_status',
            ],
            include: [
              {
                model: models.Formulary,
                as: 'formulary',
                attributes: [
                  'formulary_id',
                  'name',
                  'featured_image',
                  'short_description',
                ],
              },
            ],
          },
          {
            model: models.OrderAddress,
            as: 'order_addresses',
            attributes: [
              'order_address_id',
              'first_name',
              'last_name',
              'phone',
              'address',
              'city',
              'state_id',
              'zipcode',
              'type',
              [
                Sequelize.literal(`(
                SELECT name
                FROM states AS states_table
                WHERE ( states_table.state_id = order_addresses.state_id)
            )`),
                'statename',
              ],
            ],
          },
          {
            model: models.Users,
            as: 'users',
            attributes: [
              'user_id',
              'first_name',
              'last_name',
              'phone',
              'profile_image',
            ],
            include: [
              {
                model: models.PatientInfo,
                as: 'patient_info',
                attributes: ['user_id', 'dosespot_patient_id'],
              },
              {
                model: models.UserCards,
                as: 'user_cards',
                attributes: ['type', 'card_last_digit'],
              },
            ],
          },
        ],
      });
      let data = {};
      if (getOrderData) {
        const countIntakeQuestionData = await models.Questions.scope(
          'defaultScope',
          'intakeUserQuestionColumns'
        ).findAll({
          order: [['question_id', 'ASC']],
          where: {
            is_required: 1,
            user_id: {
              [Op.in]: [getOrderData.organization_id],
            },
          },
        });
        const countUserQuestionIntakeData = await models.UserQuestionAns.count({
          where: {
            user_id: {
              [Op.in]: [getOrderData.user_id],
            },
            order_id,
            question_id: {
              [Op.in]: countIntakeQuestionData.map((val) => val.question_id),
            },
          },
        });

        data = getOrderData.dataValues;
        data.order_id = getOrderData.order_id;
        data.user_id = getOrderData.user_id;
        data.total_amount = getOrderData.total_amount;
        data.created_at = getOrderData.created_at;
        data.order_status = getOrderData.order_status;
        data.payout_status = getOrderData.payout_status;
        data.users = getOrderData.users.dataValues;
        data.users.profile_image = await getOrderData.users.profile_image.then(
          (dataUrl) => dataUrl
        );
        data.user_cards = getOrderData.user_cards;
        await Promise.all(
          data.order_items.map(async (item) => {
            const countQuestionData = await models.Questions.scope(
              'defaultScope',
              'patientformulryUserQuestionColumns'
            ).findAll({
              order: [['question_id', 'ASC']],
              where: {
                is_required: 1,
                formulary_id: item.formulary_id,
                user_id: {
                  [Op.in]: [getOrderData.organization_id],
                },
              },
            });
            const countUserQuestionData = await models.UserQuestionAns.count({
              where: {
                user_id: {
                  [Op.in]: [getOrderData.user_id],
                },
                order_id,
                question_id: {
                  [Op.in]: countQuestionData.map((val) => val.question_id),
                },
              },
            });
            const appointmentData = await models.Bookings.findOne({
              where: {
                order_id,
                order_item_id: item.order_item_id,
                booking_status: {
                  [Op.not]: 8,
                },
              },
              order: [['bookings_id', 'DESC']],
            });
            const returnData = item.dataValues;
            returnData.formulary = item.formulary.dataValues;
            returnData.is_question_fill =
              countUserQuestionData <= countQuestionData.length &&
              countUserQuestionData !== 0
                ? 1
                : 2;
            returnData.question_count = countQuestionData.length;
            returnData.use_question_count = countUserQuestionData;
            returnData.formulary.featured_image =
              await item.formulary.featured_image.then((dataUrl) => dataUrl);
            returnData.booking_data = appointmentData;
            return returnData;
          })
        );
        data.is_intake_question_fill =
          countUserQuestionIntakeData <= countIntakeQuestionData.length &&
          countUserQuestionIntakeData !== 0
            ? 1
            : 2;
        data.intake_question_count = countIntakeQuestionData.length;
        data.user_intake_question_count = countUserQuestionIntakeData;
      }
      let dosespote_data = {};
      const organizationData = await models.Users.findOne({
        where: {
          user_id: organization_id,
        },
        include: [
          {
            model: models.OrganizationInfo,
            as: 'organization_info',
          },
        ],
      });
      if (organizationData.organization_info.dosespot_org_id) {
        dosespote_data = encryptionKey(
          organizationData.organization_info.dosespot_org_id
        );
      }

      return response.successResponse(
        req,
        res,
        'admin.get_organization_order_product_success',
        { data, dosespote_data }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientTransactionList
   * @description Get Patient Transaction List.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getPatientTransactionList(req, res) {
    try {
      const { order_id } = req.query;
      const { user_id } = req.payload.user;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const transactionData = await models.UserTransactions.findAll({
        where: {
          user_id,
          order_id,
          organization_id: organizationData.user_id,
          payment_status: 1,
        },
        attributes: [
          'transaction_id',
          'user_transaction_id',
          'user_id',
          'order_id',
          'order_item_id',
          'type',
          'payment_status',
          'amount',
          'user_card_id',
          'created_at',
        ],
        order: [['user_transaction_id', 'DESC']],
        include: [
          {
            model: models.OrderItems,
            as: 'order_items',
            where: {
              user_id,
              order_id,
              organization_id: organizationData.user_id,
            },
            attributes: ['order_item_id', 'order_id', 'formulary_id'],
            required: false,
            include: [
              {
                model: models.Formulary,
                as: 'formulary',
                attributes: ['name'],
              },
            ],
          },
          {
            model: models.UserCards,
            as: 'user_cards',
            attributes: ['type', 'card_last_digit'],
            paranoid: false,
          },
        ],
      });
      return response.successResponse(
        req,
        res,
        'admin.order_patient_transaction_get_success',
        transactionData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationMedicalIntakeDetails
   * @description Get Organization Formulary Intake Details.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getOrganizationMedicalIntakeDetails(req, res) {
    try {
      const { formulary_id, order_id } = req.query;
      const { organization_id } = req.payload.user;
      const questionData = await models.Questions.scope(
        'defaultScope',
        'patientformulryUserQuestionColumns'
      ).findAll({
        where: { formulary_id, user_id: organization_id },
        order: [['question_id', 'ASC']],
        include: [
          {
            model: models.QuestionOptions,
            as: 'question_options',
            include: [
              {
                model: models.UserQuestionAnsOption,
                as: 'user_question_ans_option',
                where: { order_id, organation_id: organization_id },
                required: false,
              },
            ],
          },
          {
            model: models.UserQuestionAns,
            as: 'user_question_ans',
            where: { order_id, organation_id: organization_id },
            required: false,
          },
        ],
      });
      const geFormulartQuestionsData = [];
      questionData.map(async (value, index) => {
        let ans_type = 1;
        let ans_value =
          value.user_question_ans !== null
            ? value.user_question_ans.ans_value
            : '';
        if (value.question_type === 6 && value.user_question_ans !== null) {
          let folder_path = '';
          const fileFolderPath = FilePath.getFolderConfig().ans_value_image;
          folder_path = fileFolderPath.file_path.replace(
            fileFolderPath.replace,
            value.user_question_ans.user_question_ans_id
          );
          folder_path += ans_value;

          ans_value = await getFileUrl(folder_path).then((dataUrl) => dataUrl);
          ans_type = 3;
        } else if (value.question_type === 7) {
          ans_type = 4;
        } else if ([3, 4, 5].includes(value.question_type)) {
          ans_type = 2;
        }
        geFormulartQuestionsData[index] = {
          user_question_ans_id:
            value.user_question_ans !== null
              ? value.user_question_ans.user_question_ans_id
              : 0,
          question_type: value.question_type,
          question_id: value.question_id,
          ans_value,
          ans_type,
          label: value.label,
          is_required: value.is_required,
          question_text:
            value.user_question_ans !== null
              ? value.user_question_ans.question_text
              : '',
          is_delete: 1,
          is_new: 1,
          user_question_ans_option: value.question_options.map((item) => ({
            user_question_ans_option_id:
              item.user_question_ans_option !== null
                ? item.user_question_ans_option.user_question_ans_option_id
                : 0,
            is_delete: 1,
            is_new: item.user_question_ans_option !== null ? 2 : 1,
            question_option_id: item.question_option_id,
            option_value: item.option_value,
          })),
        };
      });

      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.get_organization_medical_intake_success',
          geFormulartQuestionsData
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationGeneralIntakeDetails
   * @description Get Organization Checkout General Intake Details.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getOrganizationGeneralIntakeDetails(req, res) {
    try {
      const { order_id } = req.query;
      const { organization_id } = req.payload.user;
      const questionData = await models.Questions.scope(
        'defaultScope',
        'intakeUserQuestionColumns'
      ).findAll({
        order: [['question_id', 'ASC']],
        where: { user_id: organization_id },
        include: [
          {
            model: models.QuestionOptions,
            as: 'question_options',
            include: [
              {
                model: models.UserQuestionAnsOption,
                as: 'user_question_ans_option',
                where: { order_id, organation_id: organization_id },
                required: false,
              },
            ],
          },
          {
            model: models.UserQuestionAns,
            as: 'user_question_ans',
            where: { order_id, organation_id: organization_id },
            required: false,
          },
        ],
      });
      const orderDetails = await models.Orders.findOne({
        attributes: ['order_id', 'document_id', 'selfi_image'],
        where: {
          order_id,
        },
      });
      const getGeneralIntakeQuestionsData = [];
      questionData.map(async (value, index) => {
        let ans_type = 1;
        let ans_value =
          value.user_question_ans !== null
            ? value.user_question_ans.ans_value
            : '';
        if (value.question_type === 6 && value.user_question_ans !== null) {
          let folder_path = '';
          const fileFolderPath = FilePath.getFolderConfig().ans_value_image;
          folder_path = fileFolderPath.file_path.replace(
            fileFolderPath.replace,
            value.user_question_ans.user_question_ans_id
          );
          folder_path += ans_value;

          ans_value = await getFileUrl(folder_path).then((dataUrl) => dataUrl);
          ans_type = 3;
        } else if (value.question_type === 7) {
          ans_type = 4;
        } else if ([3, 4, 5].includes(value.question_type)) {
          ans_type = 2;
        }
        getGeneralIntakeQuestionsData[index] = {
          user_question_ans_id:
            value.user_question_ans !== null
              ? value.user_question_ans.user_question_ans_id
              : 0,
          question_type: value.question_type,
          question_id: value.question_id,
          ans_value,
          ans_type,
          label: value.label,
          is_required: value.is_required,
          question_text:
            value.user_question_ans !== null
              ? value.user_question_ans.question_text
              : '',
          is_delete: 1,
          is_new: 1,
          user_question_ans_option: value.question_options.map((item) => ({
            user_question_ans_option_id:
              item.user_question_ans_option !== null
                ? item.user_question_ans_option.user_question_ans_option_id
                : 0,
            is_delete: 1,
            is_new: item.user_question_ans_option !== null ? 2 : 1,
            question_option_id: item.question_option_id,
            option_value: item.option_value,
          })),
        };
      });
      if (orderDetails) {
        const data = orderDetails.dataValues;
        data.document_id = await orderDetails.document_id.then(
          (dataUrl) => dataUrl
        );
        data.selfi_image = await orderDetails.selfi_image.then(
          (dataUrl) => dataUrl
        );
        getGeneralIntakeQuestionsData.push(data);
      }
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.get_Organization_general_intake_success',
          getGeneralIntakeQuestionsData
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name storeOrderChargeData
   * @description Store Order Cahrge Data.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async storeOrderChargeData(req, res) {
    try {
      const { organization_id, email } = req.payload.user;
      const { amount, card_id, order_id, order_item_id } = req.body;
      const getCardData = await models.UserCards.findOne({
        where: { user_card_id: card_id },
        include: [
          {
            model: models.Users,
            as: 'users',
            attributes: ['user_id', 'email'],
          },
        ],
        order: [['user_card_id', 'ASC']],
      });
      if (getCardData) {
        const getChatUserData = await models.UserChatRoom.findOne({
          attributes: [
            'user_chat_room_id',
            'organization_id',
            'user_id',
            'created_at',
          ],
          include: [
            {
              model: models.Users,
              as: 'users',
              require: false,
              attributes: [
                'user_id',
                'first_name',
                'last_name',
                'profile_image',
              ],
            },
          ],
          where: {
            user_id: getCardData.user_id,
            organization_id,
          },
          order: [['created_at', 'DESC']],
        });
        const getOrderItemData = await models.OrderItems.findOne({
          where: { order_item_id },
          include: [
            {
              model: models.Formulary,
              as: 'formulary',
              attributes: ['name', 'formulary_id'],
            },
          ],
        });

        await createOneTimePayment(amount, getCardData.card_id)
          .then(async (getTransction) => {
            const transactionData =
              getTransction.data.data.createOneTimePayment;
            let payment_status = 2;
            let transaction_id = null;
            if (transactionData) {
              transaction_id = transactionData.transaction_id;
              if (['SUCCEEDED', 'SETTLED'].includes(transactionData.status)) {
                payment_status = 1;
              }
              await models.UserTransactions.findOne({
                where: {
                  order_id,
                  user_id: getCardData.user_id,
                  transaction_id,
                  user_card_id: card_id,
                  order_item_id,
                  organization_id,
                  payment_status,
                  type: 2,
                },
              }).then(async (objo) => {
                if (!objo) {
                  await models.UserTransactions.create({
                    order_id,
                    user_id: getCardData.user_id,
                    transaction_id,
                    amount,
                    user_card_id: card_id,
                    organization_id,
                    payment_status,
                    order_item_id,
                    type: 2,
                  });
                } else {
                  objo.update({
                    order_id,
                    user_id: getCardData.user_id,
                    transaction_id,
                    amount,
                    user_card_id: card_id,
                    organization_id,
                    payment_status,
                    order_item_id,
                    type: 2,
                  });
                }
              });
              if (getChatUserData && getOrderItemData) {
                const msgObj = {
                  ORDERID: order_id,
                  PRICE: amount,
                  ITEMNAME: getOrderItemData.formulary.name,
                };
                const rgxString = new RegExp(
                  Object.keys(msgObj).join('|'),
                  'gi'
                );
                const message = await translationTextMessage(
                  'admin.org_charge_chat_message_text'
                ).replace(rgxString, (matched) => msgObj[matched]);
                await models.UserChat.create({
                  message: message || null,
                  type_message: 5,
                  user_chat_room_id: getChatUserData.user_chat_room_id,
                  from_user_id: organization_id,
                  is_seen: 1,
                  to_user_id: getCardData.user_id,
                });
                await storeNotification(
                  await translationTextMessage(
                    'admin.org_charge_chat_message_title'
                  ),
                  message,
                  getCardData.user_id
                );
              }
            } else if (getTransction.data.errors) {
              throw new Error(getTransction.data.errors[0].message);
            }
          })
          .catch((error) => {
            console.log(error.response.data);
            throw new Error('admin.subscripon_not_success');
          });
        if (getCardData) {
          const isEmailSent = await emailHelper.sendEmail({
            to: email,
            template: 'telepath-order-charge-organization',
            replacements: {
              ORDER_ID: order_id,
              ORDER_ITEM_ID: order_item_id,
              AMOUNT: amount,
            },
          });
          if (!isEmailSent) {
            throw new Error('admin.order_charge_amount_mail_not_sent');
          }
        }
        if (getCardData) {
          const isEmailSent = await emailHelper.organizationSendEmail({
            to: getCardData.users.email,
            organization_id,
            template: 'telepath-order-charge-patient',
            replacements: {
              ORDER_ID: order_id,
              ORDER_ITEM_ID: order_item_id,
              AMOUNT: amount,
            },
          });
          if (!isEmailSent) {
            throw new Error('admin.order_charge_amount_mail_not_sent');
          }
        }
        return response.successResponse(
          req,
          res,
          'admin.store_order_charge_data_success'
        );
      }
      return response.errorResponse(
        req,
        res,
        'admin.store_order_charge_not_found'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name storeOrderRefundData
   * @description Store Order Refund Data.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async storeOrderRefundData(req, res) {
    try {
      const { organization_id, email } = req.payload.user;
      const { amount, card_id, order_id, order_item_id, transaction_id } =
        req.body;

      const getUserTranscrionData = await models.UserTransactions.findOne({
        where: {
          user_transaction_id: transaction_id,
        },
        include: [
          {
            model: models.Users,
            as: 'users',
            attributes: ['user_id', 'email'],
          },
        ],
      });
      if (getUserTranscrionData) {
        const getChatUserData = await models.UserChatRoom.findOne({
          attributes: [
            'user_chat_room_id',
            'organization_id',
            'user_id',
            'created_at',
          ],
          include: [
            {
              model: models.Users,
              as: 'users',
              require: false,
              attributes: [
                'user_id',
                'first_name',
                'last_name',
                'profile_image',
              ],
            },
          ],
          where: {
            user_id: getUserTranscrionData.user_id,
            organization_id,
          },
          order: [['created_at', 'DESC']],
        });
        const getOrderItemData = await models.OrderItems.findOne({
          where: { order_item_id },
          include: [
            {
              model: models.Formulary,
              as: 'formulary',
              attributes: ['name', 'formulary_id'],
            },
          ],
        });
        await createRefundPayment(
          amount,
          getUserTranscrionData.transaction_id,
          'order refund ',
          email
        ).then(async (getTransction) => {
          const transactionData = getTransction.data.data.createRefund;
          if (transactionData) {
            await models.UserTransactions.create({
              order_id,
              user_id: getUserTranscrionData.user_id,
              amount,
              user_card_id: card_id,
              organization_id,
              transaction_id: getUserTranscrionData.transaction_id,
              type: 3,
              payment_status: 1,
              order_item_id,
              ref_transaction_id: transaction_id,
            });
            await models.UserTransactions.update(
              {
                refunded_amount:
                  parseFloat(amount) +
                  parseFloat(
                    getUserTranscrionData.refunded_amount
                      ? getUserTranscrionData.refunded_amount
                      : 0
                  ),
              },
              {
                where: {
                  user_transaction_id: transaction_id,
                },
              }
            );
            if (getChatUserData && getOrderItemData) {
              const msgObj = {
                ORDERID: order_id,
                PRICE: amount,
                ITEMNAME: getOrderItemData.formulary.name,
              };
              const rgxString = new RegExp(Object.keys(msgObj).join('|'), 'gi');
              const message = await translationTextMessage(
                'admin.org_refund_chat_message_text'
              ).replace(rgxString, (matched) => msgObj[matched]);
              await models.UserChat.create({
                message: message || null,
                type_message: 4,
                user_chat_room_id: getChatUserData.user_chat_room_id,
                from_user_id: organization_id,
                is_seen: 1,
                to_user_id: getUserTranscrionData.user_id,
              });
              await storeNotification(
                await translationTextMessage(
                  'admin.org_refund_chat_message_title'
                ),
                message,
                getUserTranscrionData.user_id
              );
            }
          }
        });
        if (getUserTranscrionData) {
          const isEmailSent = await emailHelper.sendEmail({
            to: email,
            template: 'telepath-order-refund-organization',
            replacements: {
              ORDER_ID: order_id,
              ORDER_ITEM_ID: order_item_id,
              AMOUNT: amount,
            },
          });
          if (!isEmailSent) {
            throw new Error('admin.order_refund_amount_mail_not_sent');
          }
        }
        if (getUserTranscrionData) {
          const isEmailSent = await emailHelper.organizationSendEmail({
            to: getUserTranscrionData.users.email,
            organization_id,
            template: 'telepath-order-refund-patient',
            replacements: {
              ORDER_ID: order_id,
              ORDER_ITEM_ID: order_item_id,
              AMOUNT: amount,
            },
          });
          if (!isEmailSent) {
            throw new Error('admin.order_refund_amount_mail_not_sent');
          }
        }
        return response.successResponse(
          req,
          res,
          'admin.store_order_refund_data_success'
        );
      }
      return response.errorResponse(
        req,
        res,
        'admin.store_order_refund_not_found'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientOrderCardData
   * @description get Patient order Card Data.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getPatientOrderCardData(req, res) {
    try {
      const { order_id, user_id, order_item_id } = req.query;
      const getOrderData = await models.Orders.findOne({
        where: {
          order_id,
        },
        include: [
          {
            model: models.OrderItems,
            as: 'order_items',
            where: { order_item_id },
            include: [
              {
                model: models.Formulary,
                as: 'formulary',
                attributes: ['name', 'formulary_id'],
              },
            ],
          },
          {
            model: models.UserCards,
            as: 'user_cards',
            require: false,
          },
          {
            model: models.Users,
            as: 'users',
            attributes: ['user_id'],
            include: [
              {
                model: models.UserCards,
                as: 'user_cards',
                where: { user_id, is_default: 1 },
              },
            ],
          },
        ],
      });
      let user_card_data = {};
      let user_order_item = {};
      if (getOrderData) {
        if (getOrderData.users && getOrderData.users.user_cards) {
          user_card_data = getOrderData.users.user_cards;
        }
        if (getOrderData.user_cards) {
          user_card_data = getOrderData.user_cards;
        }
        if (getOrderData.order_items.length !== 0) {
          user_order_item = getOrderData.order_items[0].dataValues || [];
          if (user_order_item) {
            user_order_item.user_order_transactions =
              await models.UserTransactions.findOne({
                where: {
                  order_id,
                  type: 1,
                  payment_status: 1,
                },
              });
            user_order_item.user_order_transactions_refund =
              await models.UserTransactions.findAll({
                where: {
                  payment_status: 1,
                  order_item_id,
                  order_id,
                  type: 3,
                  ref_transaction_id:
                    user_order_item.user_order_transactions.user_transaction_id,
                },
              });
          }
          if (user_order_item) {
            user_order_item.user_transactions =
              await models.UserTransactions.findAll({
                where: {
                  payment_status: 1,
                  order_item_id,
                  order_id,
                  type: 2,
                },
              });
            user_order_item.user_transactions_refund =
              await models.UserTransactions.findAll({
                where: {
                  payment_status: 1,
                  order_item_id,
                  order_id,
                  type: 3,
                  ref_transaction_id: {
                    [Op.in]: user_order_item.user_transactions.map(
                      (o) => o.user_transaction_id
                    ),
                  },
                },
              });
          }
        }
      }
      return response.successResponse(
        req,
        res,
        'admin.store_order_charge_data_success',
        { user_card_data, user_order_item }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientRecentOrders
   * @description Get Recent patient Orders.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getPatientRecentOrders(req, res) {
    try {
      const { user_id } = req.query;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
        attributes: ['user_id'],
      });
      const recentOrders = await models.OrderItems.findAll({
        where: {
          user_id,
          organization_id: organizationData.user_id,
        },
        limit: 4,
        order: [
          ['order_id', 'DESC'],
          ['order_item_id', 'DESC'],
        ],
        attributes: [
          'order_id',
          'order_item_id',
          'formulary_id',
          'created_at',
          'transitionrx_prescription_id',
          'transitionrx_patient_id',
          'transitionrx_fill_id',
          'pre_status',
          'transitionrx_fill_status',
          'tracking_number',
          'shipped_date',
          'rx_status',
        ],
        include: [
          {
            model: models.Orders,
            as: 'orders',
            where: {
              order_status: {
                [Op.not]: [1, 6],
              },
            },
            require: true,
            attributes: ['order_id', 'user_id', 'created_at'],
          },
          {
            model: models.Formulary,
            as: 'formulary',
            require: true,
            attributes: [
              'name',
              'featured_image',
              'short_description',
              'formulary_id',
              'price',
            ],
          },
        ],
      });
      const recent_orders = recentOrders;
      recent_orders.map(async (data, index) => {
        const tempVar = { ...data.dataValues };
        tempVar.formulary = { ...data.formulary.dataValues };
        tempVar.formulary.featured_image =
          await data.formulary.featured_image.then((dataUrl) => dataUrl);
        recent_orders[index] = tempVar;
        return data;
      });
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.patient_get_recent_orders_success',
          {
            recentOrders: recent_orders,
          }
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name placeOrderPharmacy
   * @description place Order To Pharmacy.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async placeOrderPharmacy(req, res) {
    try {
      const { order_item_id } = req.query;

      const getOrderData = await models.OrderItems.findOne({
        where: {
          order_item_id,
        },
        include: [
          {
            model: models.Orders,
            as: 'orders',
            require: true,
          },
          {
            model: models.Formulary,
            as: 'formulary',
            require: true,
            attributes: ['name', 'formulary_id', 'ndc'],
          },
        ],
      });
      if (getOrderData) {
        const getOrderAddress = await models.OrderAddress.findOne({
          where: { order_id: getOrderData.order_id },
          include: [
            {
              model: models.States,
              as: 'states',
              require: true,
            },
          ],
        });
        const userData = await models.Users.findOne({
          where: {
            user_id: getOrderData.user_id,
          },
          include: [
            {
              model: models.PatientInfo,
              as: 'patient_info',
              require: true,
            },
          ],
        });
        if (!userData.patient_info) {
          throw new Error('admin.patient_details_not_fill_all');
        }
        const requestData = {
          first_name: getOrderAddress.first_name,
          last_name: getOrderAddress.last_name,
          email: getOrderAddress.email,
          dob: userData.dob || '',
          gender: userData.patient_info.gender || '',
          address: getOrderAddress.address,
          city: getOrderAddress.city,
          state: getOrderAddress.states.short_code,
          postcode: getOrderAddress.zipcode,
          phone: getOrderAddress.phone,
          ndc: getOrderData.formulary.ndc || '',
          qty: getOrderData.qty || '',
          order_item_id,
          note: getOrderData.orders.order_note || getOrderData.formulary.name,
          medication_name: getOrderData.formulary.name || '',
        };
        if (!getOrderData.formulary.ndc) {
          throw new Error('admin.org_formulary_ndc_number_not_fill');
        }

        const blankDataKey = Object.keys(requestData).filter((k) => {
          if (
            requestData[k] === '' ||
            requestData[k] === undefined ||
            requestData[k] === null
          ) {
            return k;
          }
          return '';
        });
        if (blankDataKey.length !== 0) {
          throw new Error(
            t('admin.organization_transitionrx_data_not_fill').replace(
              '{{FIELDS}}',
              blankDataKey.join(' ').replace('_', ' ')
            )
          );
        } else {
          await CreatePrescription(requestData)
            .then(async (data) => {
              if (data.data) {
                await models.OrderItems.update(
                  {
                    transitionrx_prescription_id: data.data.prescription_id,
                    transitionrx_patient_id: data.data.patient_id,
                    rx_number: data.data.rx_number,
                  },
                  {
                    where: { order_item_id },
                  }
                );
                await models.PatientInfo.update(
                  {
                    transitionrx_patient_id: data.data.patient_id,
                  },
                  {
                    where: { user_id: userData.user_id },
                  }
                );
              }
            })
            .catch((error) => {
              throw new Error(error.response.data.message);
            });
        }
        const getOrderAllItems = await models.OrderItems.findAll({
          where: {
            order_id: getOrderData.order_id,
          },
          include: [
            {
              model: models.Formulary,
              as: 'formulary',
              require: true,
              attributes: ['name', 'formulary_id', 'ndc'],
            },
          ],
        });
        let rxAcceptOrderItem = getOrderAllItems.filter(
          (v) => v.rx_status === 2 && v.transitionrx_prescription_id !== null
        );
        rxAcceptOrderItem = await Promise.all(
          rxAcceptOrderItem.map(async (m) => {
            const orderItemData = m;
            const getChatUserData = await models.UserChatRoom.findOne({
              attributes: [
                'user_chat_room_id',
                'organization_id',
                'user_id',
                'created_at',
              ],
              where: {
                user_id: orderItemData.user_id,
                organization_id: orderItemData.organization_id,
              },
              order: [['created_at', 'DESC']],
            });
            const patientData = await models.Users.findOne({
              where: { user_id: orderItemData.user_id },
            });
            const orgData = await models.Users.findOne({
              where: { user_id: orderItemData.organization_id },
            });
            await GetPrescription(
              orderItemData.transitionrx_prescription_id
            ).then(async (res_pre) => {
              if (
                orderItemData.pre_status !== 1 &&
                res_pre.data.status &&
                res_pre.data.sub_status &&
                res_pre.data.status === 'Pending' &&
                res_pre.data.sub_status === 'Patient Contact'
              ) {
                orderItemData.pre_status = 1;
                models.OrderItemStatusHistory.create({
                  order_id: orderItemData.order_id,
                  order_item_id: orderItemData.order_item_id,
                  pre_status: 1,
                });
                await this.preStatusChangeSendData(
                  orderItemData,
                  `${res_pre.data.status}(${res_pre.data.sub_status})`,
                  getChatUserData.user_chat_room_id,
                  patientData.email,
                  orgData.email
                );
              } else if (
                orderItemData.pre_status !== 2 &&
                res_pre.data.status &&
                res_pre.data.sub_status &&
                res_pre.data.status === 'Pending' &&
                res_pre.data.sub_status === 'Patient Contact - Insurance'
              ) {
                orderItemData.pre_status = 2;
                models.OrderItemStatusHistory.create({
                  order_id: orderItemData.order_id,
                  order_item_id: orderItemData.order_item_id,
                  pre_status: 2,
                });
                await this.preStatusChangeSendData(
                  orderItemData,
                  `${res_pre.data.status}(${res_pre.data.sub_status})`,
                  getChatUserData.user_chat_room_id,
                  patientData.email,
                  orgData.email
                );
              } else if (
                orderItemData.pre_status !== 3 &&
                res_pre.data.status &&
                res_pre.data.sub_status &&
                res_pre.data.status === 'Pending' &&
                res_pre.data.sub_status === 'Patient Contact – Shipping/Payment'
              ) {
                orderItemData.pre_status = 3;
                models.OrderItemStatusHistory.create({
                  order_id: orderItemData.order_id,
                  order_item_id: orderItemData.order_item_id,
                  pre_status: 3,
                });
                await this.preStatusChangeSendData(
                  orderItemData,
                  `${res_pre.data.status}(${res_pre.data.sub_status})`,
                  getChatUserData.user_chat_room_id,
                  patientData.email,
                  orgData.email
                );
              } else if (
                orderItemData.pre_status !== 4 &&
                res_pre.data.status &&
                res_pre.data.sub_status &&
                res_pre.data.status === 'Processed' &&
                res_pre.data.sub_status === 'Shipped'
              ) {
                orderItemData.pre_status = 4;
                models.OrderItemStatusHistory.create({
                  order_id: orderItemData.order_id,
                  order_item_id: orderItemData.order_item_id,
                  pre_status: 4,
                });
                await this.preStatusChangeSendData(
                  orderItemData,
                  `${res_pre.data.status}(${res_pre.data.sub_status})`,
                  getChatUserData.user_chat_room_id,
                  patientData.email,
                  orgData.email
                );
              } else if (
                orderItemData.pre_status !== 5 &&
                res_pre.data.status &&
                res_pre.data.sub_status &&
                res_pre.data.status === 'Shipped' &&
                res_pre.data.sub_status === 'Product Shipped'
              ) {
                orderItemData.pre_status = 5;
                models.OrderItemStatusHistory.create({
                  order_id: orderItemData.order_id,
                  order_item_id: orderItemData.order_item_id,
                  pre_status: 5,
                });
                await this.preStatusChangeSendData(
                  orderItemData,
                  `${res_pre.data.status}(${res_pre.data.sub_status})`,
                  getChatUserData.user_chat_room_id,
                  patientData.email,
                  orgData.email
                );
              } else if (
                orderItemData.pre_status !== 6 &&
                res_pre.data.status &&
                res_pre.data.sub_status &&
                res_pre.data.status === 'Closed' &&
                res_pre.data.sub_status === 'Patient Cancelled'
              ) {
                orderItemData.pre_status = 6;
                models.OrderItemStatusHistory.create({
                  order_id: orderItemData.order_id,
                  order_item_id: orderItemData.order_item_id,
                  pre_status: 6,
                });
                await this.preStatusChangeSendData(
                  orderItemData,
                  `${res_pre.data.status}(${res_pre.data.sub_status})`,
                  getChatUserData.user_chat_room_id,
                  patientData.email,
                  orgData.email
                );
              } else if (
                orderItemData.pre_status !== 7 &&
                res_pre.data.status &&
                res_pre.data.sub_status &&
                res_pre.data.status === 'Closed' &&
                res_pre.data.sub_status === 'Patient No Response'
              ) {
                orderItemData.pre_status = 7;
                models.OrderItemStatusHistory.create({
                  order_id: orderItemData.order_id,
                  order_item_id: orderItemData.order_item_id,
                  pre_status: 7,
                });
                await this.preStatusChangeSendData(
                  orderItemData,
                  `${res_pre.data.status}(${res_pre.data.sub_status})`,
                  getChatUserData.user_chat_room_id,
                  patientData.email,
                  orgData.email
                );
              } else if (
                orderItemData.pre_status !== 8 &&
                res_pre.data.status &&
                res_pre.data.sub_status &&
                res_pre.data.status === 'Closed' &&
                res_pre.data.sub_status === 'Patient Declined Therapy'
              ) {
                orderItemData.pre_status = 8;
                models.OrderItemStatusHistory.create({
                  order_id: orderItemData.order_id,
                  order_item_id: orderItemData.order_item_id,
                  pre_status: 8,
                });
                await this.preStatusChangeSendData(
                  orderItemData,
                  `${res_pre.data.status}(${res_pre.data.sub_status})`,
                  getChatUserData.user_chat_room_id,
                  patientData.email,
                  orgData.email
                );
              } else if (
                orderItemData.pre_status !== 9 &&
                res_pre.data.status &&
                res_pre.data.sub_status &&
                res_pre.data.status === 'Closed' &&
                res_pre.data.sub_status === 'Prescriber No Response'
              ) {
                orderItemData.pre_status = 9;
                models.OrderItemStatusHistory.create({
                  order_id: orderItemData.order_id,
                  order_item_id: orderItemData.order_item_id,
                  pre_status: 9,
                });
                await this.preStatusChangeSendData(
                  orderItemData,
                  `${res_pre.data.status}(${res_pre.data.sub_status})`,
                  getChatUserData.user_chat_room_id,
                  patientData.email,
                  orgData.email
                );
              } else if (
                orderItemData.pre_status !== 10 &&
                res_pre.data.status &&
                res_pre.data.sub_status &&
                res_pre.data.status === 'Closed' &&
                res_pre.data.sub_status === 'Prescriber Cancelled Therapy'
              ) {
                orderItemData.pre_status = 10;
                models.OrderItemStatusHistory.create({
                  order_id: orderItemData.order_id,
                  order_item_id: orderItemData.order_item_id,
                  pre_status: 10,
                });
                await this.preStatusChangeSendData(
                  orderItemData,
                  `${res_pre.data.status}(${res_pre.data.sub_status})`,
                  getChatUserData.user_chat_room_id,
                  patientData.email,
                  orgData.email
                );
              }
              await orderItemData.save();
            });

            return orderItemData;
          })
        );
        rxAcceptOrderItem = rxAcceptOrderItem.filter(
          (v) =>
            v.rx_status === 2 &&
            v.pre_status === 4 &&
            v.transitionrx_prescription_id !== null &&
            v.transitionrx_fill_status == null
        );
        const rxRejectOrderItem = getOrderAllItems.filter(
          (vr) =>
            [3, 4].includes(vr.rx_status) &&
            vr.transitionrx_prescription_id === null
        );
        let checkFillRequest = 0;
        if (
          getOrderAllItems.length === 1 &&
          rxAcceptOrderItem.length === 1 &&
          rxRejectOrderItem.length === 0
        ) {
          checkFillRequest = 1;
        } else if (
          getOrderAllItems.length === 2 &&
          rxAcceptOrderItem.length === 1 &&
          rxRejectOrderItem.length === 1
        ) {
          checkFillRequest = 1;
        } else if (
          getOrderAllItems.length >= 1 &&
          rxAcceptOrderItem.length === 1
        ) {
          checkFillRequest = 1;
        }
        if (checkFillRequest === 1) {
          const medications_data = rxAcceptOrderItem.map((m) => ({
            prescription_id: m.transitionrx_prescription_id,
          }));
          await CreateFillRequest(
            medications_data,
            getOrderAddress,
            getOrderData.order_id
          )
            .then(async (resp) => {
              if (resp.data.fill_id) {
                await models.OrderItems.update(
                  {
                    transitionrx_fill_id: resp.data.fill_id,
                    transitionrx_fill_status: 1,
                  },
                  {
                    where: {
                      order_item_id: {
                        [Op.in]: rxAcceptOrderItem.map(
                          (rx) => rx.order_item_id
                        ),
                      },
                    },
                  }
                );
              } else {
                // throw new Error(resp.data.message);
              }
            })
            .catch((error) => {
              if (error.response.data)
                throw new Error(error.response.data.message);
              else throw new Error(error);
            });

          rxAcceptOrderItem = await Promise.all(
            rxAcceptOrderItem.map(async (m) => {
              const orderItemData = m;
              const getChatUserData = await models.UserChatRoom.findOne({
                attributes: [
                  'user_chat_room_id',
                  'organization_id',
                  'user_id',
                  'created_at',
                ],
                where: {
                  user_id: orderItemData.user_id,
                  organization_id: orderItemData.organization_id,
                },
                order: [['created_at', 'DESC']],
              });
              const patientData = await models.Users.findOne({
                where: { user_id: orderItemData.user_id },
              });
              const orgData = await models.Users.findOne({
                where: { user_id: orderItemData.organization_id },
              });
              await GetFillRequest(orderItemData.transitionrx_fill_id).then(
                async (res_fill) => {
                  if (
                    res_fill.data.status &&
                    res_fill.data.status === 'Placed' &&
                    orderItemData.transitionrx_fill_status !== 1
                  ) {
                    orderItemData.transitionrx_fill_status = 1;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 1,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                    this.OrderStatusChange(orderItemData.order_id, 4);
                  } else if (
                    res_fill.data.status &&
                    res_fill.data.status === 'Replacement' &&
                    orderItemData.transitionrx_fill_status !== 2
                  ) {
                    orderItemData.transitionrx_fill_status = 2;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 2,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                  } else if (
                    res_fill.data.status &&
                    res_fill.data.status === 'Shipped' &&
                    orderItemData.transitionrx_fill_status !== 3
                  ) {
                    orderItemData.transitionrx_fill_status = 3;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 3,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                    this.OrderStatusChange(orderItemData.order_id, 5);
                  } else if (
                    res_fill.data.status &&
                    res_fill.data.status === 'Cancelled' &&
                    orderItemData.transitionrx_fill_status !== 4
                  ) {
                    orderItemData.transitionrx_fill_status = 4;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 4,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                  } else if (
                    orderItemData.transitionrx_fill_status !== 5 &&
                    res_fill.data.status &&
                    res_fill.data.sub_status &&
                    res_fill.data.status === 'Exception' &&
                    res_fill.data.sub_status === 'Missing Rx'
                  ) {
                    orderItemData.transitionrx_fill_status = 5;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 5,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}(${res_fill.data.sub_status})`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                  } else if (
                    orderItemData.transitionrx_fill_status !== 6 &&
                    res_fill.data.status &&
                    res_fill.data.sub_status &&
                    res_fill.data.status === 'Exception' &&
                    res_fill.data.sub_status === 'Expired'
                  ) {
                    orderItemData.transitionrx_fill_status = 6;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 6,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}(${res_fill.data.sub_status})`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                  } else if (
                    orderItemData.transitionrx_fill_status !== 7 &&
                    res_fill.data.status &&
                    res_fill.data.sub_status &&
                    res_fill.data.status === 'Exception' &&
                    res_fill.data.sub_status === 'Too Soon'
                  ) {
                    orderItemData.transitionrx_fill_status = 7;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 7,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}(${res_fill.data.sub_status})`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                  } else if (
                    orderItemData.transitionrx_fill_status !== 8 &&
                    res_fill.data.status &&
                    res_fill.data.sub_status &&
                    res_fill.data.status === 'Exception' &&
                    res_fill.data.sub_status === 'DOB'
                  ) {
                    orderItemData.transitionrx_fill_status = 8;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 8,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}(${res_fill.data.sub_status})`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                  } else if (
                    orderItemData.transitionrx_fill_status !== 9 &&
                    res_fill.data.status &&
                    res_fill.data.sub_status &&
                    res_fill.data.status === 'Exception' &&
                    res_fill.data.sub_status === 'Name'
                  ) {
                    orderItemData.transitionrx_fill_status = 9;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 9,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}(${res_fill.data.sub_status})`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                  } else if (
                    orderItemData.transitionrx_fill_status !== 10 &&
                    res_fill.data.status &&
                    res_fill.data.sub_status &&
                    res_fill.data.status === 'Exception' &&
                    res_fill.data.sub_status === 'Address'
                  ) {
                    orderItemData.transitionrx_fill_status = 10;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 10,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}(${res_fill.data.sub_status})`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                  } else if (
                    orderItemData.transitionrx_fill_status !== 11 &&
                    res_fill.data.status &&
                    res_fill.data.sub_status &&
                    res_fill.data.status === 'Exception' &&
                    res_fill.data.sub_status === 'RX Confirmation'
                  ) {
                    orderItemData.transitionrx_fill_status = 11;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 11,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}(${res_fill.data.sub_status})`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                  } else if (
                    orderItemData.transitionrx_fill_status !== 12 &&
                    res_fill.data.status &&
                    res_fill.data.sub_status &&
                    res_fill.data.status === 'Exception' &&
                    res_fill.data.sub_status === 'Pending'
                  ) {
                    orderItemData.transitionrx_fill_status = 12;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 12,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}(${res_fill.data.sub_status})`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                  }
                  orderItemData.tracking_number = res_fill.data.tracking_number;
                  orderItemData.shipped_date = res_fill.data.shipped_date;
                  await orderItemData.save();
                }
              );
            })
          );
        }
        return response.successResponse(
          req,
          res,
          'admin.patient_order_palce_to_pharmacy_success'
        );
      }
      return response.errorResponse(
        req,
        res,
        'admin.patient_order_item_not_found'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name OrderPlaceFillRequest
   * @description Order Item Place in fill request.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async OrderPlaceFillRequest(req, res) {
    try {
      const { order_id, order_item_id } = req.body;
      const getOrderData = await models.Orders.findOne({
        where: {
          order_id,
        },
      });
      if (getOrderData) {
        const getOrderAddress = await models.OrderAddress.findOne({
          where: { order_id: getOrderData.order_id },
          include: [
            {
              model: models.States,
              as: 'states',
              require: true,
            },
          ],
        });
        const userData = await models.Users.findOne({
          where: {
            user_id: getOrderData.user_id,
          },
          include: [
            {
              model: models.PatientInfo,
              as: 'patient_info',
              require: true,
            },
          ],
        });
        if (!userData.patient_info) {
          throw new Error('admin.patient_details_not_fill_all');
        }
        const requestData = {
          first_name: getOrderAddress.first_name,
          last_name: getOrderAddress.last_name,
          email: getOrderAddress.email,
          dob: userData.dob || '',
          gender: userData.patient_info.gender || '',
          address: getOrderAddress.address,
          city: getOrderAddress.city,
          state: getOrderAddress.states.short_code,
          postcode: getOrderAddress.zipcode,
          phone: getOrderAddress.phone,
        };
        let rxAcceptOrderItem = await models.OrderItems.findAll({
          where: {
            order_item_id: {
              [Op.in]: order_item_id,
            },
          },
          include: [
            {
              model: models.Formulary,
              as: 'formulary',
              require: true,
              attributes: ['name', 'formulary_id', 'ndc'],
            },
          ],
        });
        rxAcceptOrderItem = await Promise.all(
          rxAcceptOrderItem.map(async (item) => {
            const orderItemData = item;
            requestData.ndc = orderItemData.formulary.ndc;
            requestData.qty = orderItemData.qty || '';
            requestData.order_item_id = orderItemData.order_item_id;
            requestData.note =
              getOrderData.order_note || orderItemData.formulary.name;
            requestData.medication_name = orderItemData.formulary.name || '';
            if (!orderItemData.formulary.ndc) {
              throw new Error('admin.org_formulary_ndc_number_not_fill');
            }
            const blankDataKey = Object.keys(requestData).filter((k) => {
              if (
                requestData[k] === '' ||
                requestData[k] === undefined ||
                requestData[k] === null
              ) {
                return k;
              }
              return '';
            });
            if (blankDataKey.length !== 0) {
              throw new Error(
                t('admin.organization_transitionrx_data_not_fill').replace(
                  '{{FIELDS}}',
                  blankDataKey.join(' ').replace('_', ' ')
                )
              );
            } else {
              await CreatePrescription(requestData)
                .then(async (data) => {
                  if (data.data) {
                    orderItemData.transitionrx_prescription_id =
                      data.data.prescription_id;
                    orderItemData.transitionrx_patient_id =
                      data.data.patient_id;
                    orderItemData.rx_number = data.data.rx_number;
                    await orderItemData.save();
                  }
                })
                .catch((error) => {
                  throw new Error(error.response.data.message);
                  // else throw new Error(error);
                });
            }
            return orderItemData;
          })
        );
        rxAcceptOrderItem = await Promise.all(
          rxAcceptOrderItem.map(async (m) => {
            const orderItemData = m;
            const getChatUserData = await models.UserChatRoom.findOne({
              attributes: [
                'user_chat_room_id',
                'organization_id',
                'user_id',
                'created_at',
              ],
              where: {
                user_id: orderItemData.user_id,
                organization_id: orderItemData.organization_id,
              },
              order: [['created_at', 'DESC']],
            });
            const patientData = await models.Users.findOne({
              where: { user_id: orderItemData.user_id },
            });
            const orgData = await models.Users.findOne({
              where: { user_id: orderItemData.organization_id },
            });
            await GetPrescription(
              orderItemData.transitionrx_prescription_id
            ).then(async (res_pre) => {
              if (
                orderItemData.pre_status !== 1 &&
                res_pre.data.status &&
                res_pre.data.sub_status &&
                res_pre.data.status === 'Pending' &&
                res_pre.data.sub_status === 'Patient Contact'
              ) {
                orderItemData.pre_status = 1;
                models.OrderItemStatusHistory.create({
                  order_id: orderItemData.order_id,
                  order_item_id: orderItemData.order_item_id,
                  pre_status: 1,
                });
                await this.preStatusChangeSendData(
                  orderItemData,
                  `${res_pre.data.status}(${res_pre.data.sub_status})`,
                  getChatUserData.user_chat_room_id,
                  patientData.email,
                  orgData.email
                );
              } else if (
                orderItemData.pre_status !== 2 &&
                res_pre.data.status &&
                res_pre.data.sub_status &&
                res_pre.data.status === 'Pending' &&
                res_pre.data.sub_status === 'Patient Contact - Insurance'
              ) {
                orderItemData.pre_status = 2;
                models.OrderItemStatusHistory.create({
                  order_id: orderItemData.order_id,
                  order_item_id: orderItemData.order_item_id,
                  pre_status: 2,
                });
                await this.preStatusChangeSendData(
                  orderItemData,
                  `${res_pre.data.status}(${res_pre.data.sub_status})`,
                  getChatUserData.user_chat_room_id,
                  patientData.email,
                  orgData.email
                );
              } else if (
                orderItemData.pre_status !== 3 &&
                res_pre.data.status &&
                res_pre.data.sub_status &&
                res_pre.data.status === 'Pending' &&
                res_pre.data.sub_status === 'Patient Contact – Shipping/Payment'
              ) {
                orderItemData.pre_status = 3;
                models.OrderItemStatusHistory.create({
                  order_id: orderItemData.order_id,
                  order_item_id: orderItemData.order_item_id,
                  pre_status: 3,
                });
                await this.preStatusChangeSendData(
                  orderItemData,
                  `${res_pre.data.status}(${res_pre.data.sub_status})`,
                  getChatUserData.user_chat_room_id,
                  patientData.email,
                  orgData.email
                );
              } else if (
                orderItemData.pre_status !== 4 &&
                res_pre.data.status &&
                res_pre.data.sub_status &&
                res_pre.data.status === 'Processed' &&
                res_pre.data.sub_status === 'Shipped'
              ) {
                orderItemData.pre_status = 4;
                models.OrderItemStatusHistory.create({
                  order_id: orderItemData.order_id,
                  order_item_id: orderItemData.order_item_id,
                  pre_status: 4,
                });

                await this.preStatusChangeSendData(
                  orderItemData,
                  `${res_pre.data.status}(${res_pre.data.sub_status})`,
                  getChatUserData.user_chat_room_id,
                  patientData.email,
                  orgData.email
                );
              } else if (
                orderItemData.pre_status !== 5 &&
                res_pre.data.status &&
                res_pre.data.sub_status &&
                res_pre.data.status === 'Shipped' &&
                res_pre.data.sub_status === 'Product Shipped'
              ) {
                orderItemData.pre_status = 5;
                models.OrderItemStatusHistory.create({
                  order_id: orderItemData.order_id,
                  order_item_id: orderItemData.order_item_id,
                  pre_status: 5,
                });
                await this.preStatusChangeSendData(
                  orderItemData,
                  `${res_pre.data.status}(${res_pre.data.sub_status})`,
                  getChatUserData.user_chat_room_id,
                  patientData.email,
                  orgData.email
                );
              } else if (
                orderItemData.pre_status !== 6 &&
                res_pre.data.status &&
                res_pre.data.sub_status &&
                res_pre.data.status === 'Closed' &&
                res_pre.data.sub_status === 'Patient Cancelled'
              ) {
                orderItemData.pre_status = 6;
                models.OrderItemStatusHistory.create({
                  order_id: orderItemData.order_id,
                  order_item_id: orderItemData.order_item_id,
                  pre_status: 6,
                });
                await this.preStatusChangeSendData(
                  orderItemData,
                  `${res_pre.data.status}(${res_pre.data.sub_status})`,
                  getChatUserData.user_chat_room_id,
                  patientData.email,
                  orgData.email
                );
              } else if (
                orderItemData.pre_status !== 7 &&
                res_pre.data.status &&
                res_pre.data.sub_status &&
                res_pre.data.status === 'Closed' &&
                res_pre.data.sub_status === 'Patient No Response'
              ) {
                orderItemData.pre_status = 7;
                models.OrderItemStatusHistory.create({
                  order_id: orderItemData.order_id,
                  order_item_id: orderItemData.order_item_id,
                  pre_status: 7,
                });
                await this.preStatusChangeSendData(
                  orderItemData,
                  `${res_pre.data.status}(${res_pre.data.sub_status})`,
                  getChatUserData.user_chat_room_id,
                  patientData.email,
                  orgData.email
                );
              } else if (
                orderItemData.pre_status !== 8 &&
                res_pre.data.status &&
                res_pre.data.sub_status &&
                res_pre.data.status === 'Closed' &&
                res_pre.data.sub_status === 'Patient Declined Therapy'
              ) {
                orderItemData.pre_status = 8;
                models.OrderItemStatusHistory.create({
                  order_id: orderItemData.order_id,
                  order_item_id: orderItemData.order_item_id,
                  pre_status: 8,
                });
                await this.preStatusChangeSendData(
                  orderItemData,
                  `${res_pre.data.status}(${res_pre.data.sub_status})`,
                  getChatUserData.user_chat_room_id,
                  patientData.email,
                  orgData.email
                );
              } else if (
                orderItemData.pre_status !== 9 &&
                res_pre.data.status &&
                res_pre.data.sub_status &&
                res_pre.data.status === 'Closed' &&
                res_pre.data.sub_status === 'Prescriber No Response'
              ) {
                orderItemData.pre_status = 9;
                models.OrderItemStatusHistory.create({
                  order_id: orderItemData.order_id,
                  order_item_id: orderItemData.order_item_id,
                  pre_status: 9,
                });
                await this.preStatusChangeSendData(
                  orderItemData,
                  `${res_pre.data.status}(${res_pre.data.sub_status})`,
                  getChatUserData.user_chat_room_id,
                  patientData.email,
                  orgData.email
                );
              } else if (
                orderItemData.pre_status !== 10 &&
                res_pre.data.status &&
                res_pre.data.sub_status &&
                res_pre.data.status === 'Closed' &&
                res_pre.data.sub_status === 'Prescriber Cancelled Therapy'
              ) {
                orderItemData.pre_status = 10;
                models.OrderItemStatusHistory.create({
                  order_id: orderItemData.order_id,
                  order_item_id: orderItemData.order_item_id,
                  pre_status: 10,
                });
                await this.preStatusChangeSendData(
                  orderItemData,
                  `${res_pre.data.status}(${res_pre.data.sub_status})`,
                  getChatUserData.user_chat_room_id,
                  patientData.email,
                  orgData.email
                );
              }
              await orderItemData.save();
            });

            return orderItemData;
          })
        );
        rxAcceptOrderItem = rxAcceptOrderItem.filter(
          (v) =>
            v.rx_status === 2 &&
            v.pre_status === 4 &&
            v.transitionrx_prescription_id !== null
        );
        if (rxAcceptOrderItem.length !== 0) {
          const medications_data = rxAcceptOrderItem.map((m) => ({
            prescription_id: m.transitionrx_prescription_id,
          }));
          await CreateFillRequest(
            medications_data,
            getOrderAddress,
            getOrderData.order_id
          )
            .then(async (resp) => {
              if (resp.data.fill_id) {
                await models.OrderItems.update(
                  {
                    transitionrx_fill_id: resp.data.fill_id,
                    transitionrx_fill_status: 1,
                  },
                  {
                    where: {
                      order_item_id: {
                        [Op.in]: rxAcceptOrderItem.map(
                          (rx) => rx.order_item_id
                        ),
                      },
                    },
                  }
                );
              }
            })
            .catch((error) => {
              if (error.response.data)
                throw new Error(error.response.data.message);
              else throw new Error(error);
            });
          rxAcceptOrderItem = await Promise.all(
            rxAcceptOrderItem.map(async (m) => {
              const orderItemData = m;
              const getChatUserData = await models.UserChatRoom.findOne({
                attributes: [
                  'user_chat_room_id',
                  'organization_id',
                  'user_id',
                  'created_at',
                ],
                where: {
                  user_id: orderItemData.user_id,
                  organization_id: orderItemData.organization_id,
                },
                order: [['created_at', 'DESC']],
              });
              const patientData = await models.Users.findOne({
                where: { user_id: orderItemData.user_id },
              });
              const orgData = await models.Users.findOne({
                where: { user_id: orderItemData.organization_id },
              });
              await GetFillRequest(orderItemData.transitionrx_fill_id).then(
                async (res_fill) => {
                  if (
                    res_fill.data.status &&
                    res_fill.data.status === 'Placed' &&
                    orderItemData.transitionrx_fill_status !== 1
                  ) {
                    orderItemData.transitionrx_fill_status = 1;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 1,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                    this.OrderStatusChange(orderItemData.order_id, 4);
                  } else if (
                    res_fill.data.status &&
                    res_fill.data.status === 'Replacement' &&
                    orderItemData.transitionrx_fill_status !== 2
                  ) {
                    orderItemData.transitionrx_fill_status = 2;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 2,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                  } else if (
                    res_fill.data.status &&
                    res_fill.data.status === 'Shipped' &&
                    orderItemData.transitionrx_fill_status !== 3
                  ) {
                    orderItemData.transitionrx_fill_status = 3;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 3,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                    this.OrderStatusChange(orderItemData.order_id, 5);
                  } else if (
                    res_fill.data.status &&
                    res_fill.data.status === 'Cancelled' &&
                    orderItemData.transitionrx_fill_status !== 4
                  ) {
                    orderItemData.transitionrx_fill_status = 4;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 4,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                  } else if (
                    orderItemData.transitionrx_fill_status !== 5 &&
                    res_fill.data.status &&
                    res_fill.data.sub_status &&
                    res_fill.data.status === 'Exception' &&
                    res_fill.data.sub_status === 'Missing Rx'
                  ) {
                    orderItemData.transitionrx_fill_status = 5;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 5,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}(${res_fill.data.sub_status})`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                  } else if (
                    orderItemData.transitionrx_fill_status !== 6 &&
                    res_fill.data.status &&
                    res_fill.data.sub_status &&
                    res_fill.data.status === 'Exception' &&
                    res_fill.data.sub_status === 'Expired'
                  ) {
                    orderItemData.transitionrx_fill_status = 6;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 6,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}(${res_fill.data.sub_status})`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                  } else if (
                    orderItemData.transitionrx_fill_status !== 7 &&
                    res_fill.data.status &&
                    res_fill.data.sub_status &&
                    res_fill.data.status === 'Exception' &&
                    res_fill.data.sub_status === 'Too Soon'
                  ) {
                    orderItemData.transitionrx_fill_status = 7;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 7,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}(${res_fill.data.sub_status})`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                  } else if (
                    orderItemData.transitionrx_fill_status !== 8 &&
                    res_fill.data.status &&
                    res_fill.data.sub_status &&
                    res_fill.data.status === 'Exception' &&
                    res_fill.data.sub_status === 'DOB'
                  ) {
                    orderItemData.transitionrx_fill_status = 8;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 8,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}(${res_fill.data.sub_status})`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                  } else if (
                    orderItemData.transitionrx_fill_status !== 9 &&
                    res_fill.data.status &&
                    res_fill.data.sub_status &&
                    res_fill.data.status === 'Exception' &&
                    res_fill.data.sub_status === 'Name'
                  ) {
                    orderItemData.transitionrx_fill_status = 9;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 9,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}(${res_fill.data.sub_status})`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                  } else if (
                    orderItemData.transitionrx_fill_status !== 10 &&
                    res_fill.data.status &&
                    res_fill.data.sub_status &&
                    res_fill.data.status === 'Exception' &&
                    res_fill.data.sub_status === 'Address'
                  ) {
                    orderItemData.transitionrx_fill_status = 10;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 10,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}(${res_fill.data.sub_status})`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                  } else if (
                    orderItemData.transitionrx_fill_status !== 11 &&
                    res_fill.data.status &&
                    res_fill.data.sub_status &&
                    res_fill.data.status === 'Exception' &&
                    res_fill.data.sub_status === 'RX Confirmation'
                  ) {
                    orderItemData.transitionrx_fill_status = 11;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 11,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}(${res_fill.data.sub_status})`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                  } else if (
                    orderItemData.transitionrx_fill_status !== 12 &&
                    res_fill.data.status &&
                    res_fill.data.sub_status &&
                    res_fill.data.status === 'Exception' &&
                    res_fill.data.sub_status === 'Pending'
                  ) {
                    orderItemData.transitionrx_fill_status = 12;
                    models.OrderItemStatusHistory.create({
                      order_id: orderItemData.order_id,
                      order_item_id: orderItemData.order_item_id,
                      transitionrx_fill_status: 12,
                    });
                    await this.fillStatusChangeSendData(
                      orderItemData,
                      `${res_fill.data.status}(${res_fill.data.sub_status})`,
                      getChatUserData.user_chat_room_id,
                      patientData.email,
                      orgData.email
                    );
                  }
                  orderItemData.tracking_number = res_fill.data.tracking_number;
                  orderItemData.shipped_date = res_fill.data.shipped_date;
                  await orderItemData.save();
                }
              );
            })
          );
          return response.successResponse(
            req,
            res,
            'admin.patient_order_palce_to_pharmacy_fill_success'
          );
        }
      }

      return response.errorResponse(
        req,
        res,
        'admin.patient_order_item_not_found'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name OrderItemRxStatusChange
   * @description Order Item Rx Status Update.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async OrderItemRxStatusChange(req, res) {
    try {
      const { order_item_id, status } = req.query;
      const getOrderItemData = await models.OrderItems.findOne({
        where: {
          order_item_id,
        },
        include: [
          {
            model: models.Formulary,
            as: 'formulary',
            attributes: ['name', 'formulary_id'],
          },
        ],
      });
      if (getOrderItemData) {
        if (getOrderItemData.rx_status === status) {
          return response.errorResponse(
            req,
            res,
            'admin.order_item_rx_status_already_set',
            {},
            422
          );
        }
        getOrderItemData.rx_status = status;
        await getOrderItemData.save();
        models.OrderItemStatusHistory.create({
          order_id: getOrderItemData.order_id,
          order_item_id: getOrderItemData.order_item_id,
          rx_status: status,
        });
        let getChatUserData = await models.UserChatRoom.findOne({
          attributes: [
            'user_chat_room_id',
            'organization_id',
            'user_id',
            'created_at',
          ],
          where: {
            user_id: getOrderItemData.user_id,
            organization_id: getOrderItemData.organization_id,
          },
          order: [['created_at', 'DESC']],
        });
        if (!getChatUserData) {
          getChatUserData = await models.UserChatRoom.create({
            user_id: getOrderItemData.user_id,
            organization_id: getOrderItemData.organization_id,
          });
        }
        const msgObj = {
          ORDERID: getOrderItemData.order_id,
          PRICE: getOrderItemData.sub_total,
          ITEMNAME: getOrderItemData.formulary.name,
        };
        const rgxString = new RegExp(Object.keys(msgObj).join('|'), 'gi');
        let message = await translationTextMessage(
          'admin.org_rx_status_accept_chat_message_text'
        ).replace(rgxString, (matched) => msgObj[matched]);
        let title = await translationTextMessage(
          'admin.org_rx_status_accept_chat_message_title'
        );
        let template = 'order-item-rx-status-accept';
        if (parseInt(status, 10) === 3) {
          template = 'telepath-order-item-rx-status-reject';
          message = await translationTextMessage(
            'admin.org_rx_status_reject_chat_message_text'
          ).replace(rgxString, (matched) => msgObj[matched]);
          title = await translationTextMessage(
            'admin.org_rx_status_reject_chat_message_title'
          );
          this.OrderStatusChange(getOrderItemData.order_id, 6);
        } else if (parseInt(status, 10) === 2) {
          template = 'telepath-order-item-rx-status-accept';
          message = await translationTextMessage(
            'admin.org_rx_status_accept_chat_message_text'
          ).replace(rgxString, (matched) => msgObj[matched]);
          title = await translationTextMessage(
            'admin.org_rx_status_accept_chat_message_title'
          );
          this.OrderStatusChange(getOrderItemData.order_id, 3);
        } else if (parseInt(status, 10) === 5) {
          getOrderItemData.transitionrx_prescription_id = null;
          getOrderItemData.transitionrx_patient_id = null;
          getOrderItemData.rx_number = null;
          getOrderItemData.pre_status = null;
          getOrderItemData.transitionrx_fill_id = null;
          getOrderItemData.tracking_number = null;
          getOrderItemData.shipped_date = null;
          getOrderItemData.transitionrx_fill_status = null;
          await getOrderItemData.save();
          template = 'telepath-order-item-rx-status-cancel';
          message = await translationTextMessage(
            'admin.org_rx_status_cancel_chat_message_text'
          ).replace(rgxString, (matched) => msgObj[matched]);
          title = await translationTextMessage(
            'admin.org_rx_status_cancel_chat_message_title'
          );
          this.OrderStatusChange(getOrderItemData.order_id, 3);
        }
        await models.UserChat.create({
          message: message || null,
          type_message: 6,
          user_chat_room_id: getChatUserData.user_chat_room_id,
          from_user_id: getOrderItemData.organization_id,
          is_seen: 1,
          to_user_id: getOrderItemData.user_id,
        });
        const userData = await models.Users.findOne({
          where: { user_id: getOrderItemData.user_id },
        });
        await emailHelper.organizationSendEmail({
          to: userData.email,
          organization_id: getOrderItemData.organization_id,
          template,
          replacements: {
            ORDER_ID: getOrderItemData.order_id,
            ORDER_ITEM_NAME: getOrderItemData.formulary.name,
            AMOUNT: getOrderItemData.sub_total,
          },
        });
        await storeNotification(title, message, getOrderItemData.user_id);
        return response.successResponse(
          req,
          res,
          'admin.order_item_rx_status_change_success'
        );
      }
      return response.errorResponse(
        req,
        res,
        'admin.order_item_data_not_found',
        {},
        422
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}

module.exports = new OrderController();
