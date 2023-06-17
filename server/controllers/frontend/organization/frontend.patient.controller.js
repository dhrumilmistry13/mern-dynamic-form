const { Op } = require('sequelize');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');
const FilePath = require('../../../config/upload.config');
const { getFileUrl } = require('../../../helpers/s3file.helper');
const PaginationLength = require('../../../config/pagination.config');

class PatientController {
  /**
   * @name getPatientGeneralDetails
   * @description Get Patient General Details.
   * @param req,res
   * @returns {Json} success
   */

  async getPatientGeneralDetails(req, res) {
    try {
      const fields = [
        'first_name',
        'last_name',
        'email',
        'country_id',
        'phone',
        'dob',
        'user_id',
        'admin_status',
        'user_status',
        'reason',
        'dob',
        'organation_id',
        'profile_image',
      ];
      const { user_id } = req.query;
      const getPatientData = await models.Users.findOne({
        attributes: fields,
        where: {
          user_id,
        },
        require: false,
        include: [
          {
            model: models.Countries,
            as: 'countries',
            attributes: ['phone_code'],
            require: false,
          },
        ],
      });
      let patientData = {};
      if (
        getPatientData &&
        typeof getPatientData === 'object' &&
        getPatientData &&
        getPatientData.users !== ''
      ) {
        const getPatientInfoData = await models.PatientInfo.findOne({
          where: {
            user_id,
          },
        });
        patientData = {
          first_name: getPatientData.first_name,
          last_name: getPatientData.last_name,
          email: getPatientData.email,
          country_id: getPatientData.country_id,
          phone: getPatientData.phone,
          user_id: getPatientData.user_id,
          admin_status: getPatientData.admin_status,
          user_status: getPatientData.user_status,
          dob: getPatientData.dob,
          reason: getPatientData.reason,
          organation_id: getPatientData.organation_id,
          profile_image: await getPatientData.profile_image.then(
            (dataUrl) => dataUrl
          ),
          patient_info: getPatientInfoData,
        };
        if (
          getPatientData.countries &&
          getPatientData.countries !== '' &&
          getPatientData.countries !== null
        ) {
          patientData.phone_code = getPatientData.countries
            ? getPatientData.countries.phone_code
            : '';
        } else {
          patientData.phone_code = '';
        }
      }
      return response.successResponse(
        req,
        res,
        'admin.get_patient_organization_success',
        { patientData }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientBasicDetails
   * @description Get All Patient Basic Details filled Questions on registration time
   * @param req,res
   * @returns {Json} success
   */
  async getPatientBasicDetails(req, res) {
    try {
      const { user_id } = req.query;
      const getPatientGeneralData = await models.Questions.scope(
        'defaultScope',
        'patientSignupQuestionsDetails'
      ).findAll({
        order: [
          ['sequence', 'ASC'],
          ['label', 'ASC'],
        ],
        include: [
          {
            model: models.QuestionOptions,
            as: 'question_options',
            include: [
              {
                model: models.UserQuestionAnsOption,
                as: 'user_question_ans_option',
                where: { user_id },
                required: false,
              },
            ],
          },
          {
            model: models.UserQuestionAns,
            as: 'user_question_ans',
            where: { user_id },
            required: false,
          },
        ],
      });
      const QuestionData = [];
      getPatientGeneralData.map(async (value, index) => {
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
        } else if (value.question_type === 8 && ans_value) {
          const getStateData = await models.States.findOne({
            where: {
              state_id: ans_value,
            },
          });
          ans_value = getStateData
            ? `${getStateData.name} (${getStateData.short_code})`
            : '';
        }
        QuestionData[index] = {
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
          'admin.get_patient_basic_details_success',
          QuestionData
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientInsuranceDetails
   * @description Get Patient's Insurance Details
   * @param req,res
   * @returns {Json} success
   */
  async getPatientInsuranceDetails(req, res) {
    try {
      const { user_id } = req.query;
      const getPatientInsuranceData = await models.Questions.scope(
        'defaultScope',
        'patientInsuranceQuestionsDetails'
      ).findAll({
        order: [
          ['sequence', 'ASC'],
          ['label', 'ASC'],
        ],
        include: [
          {
            model: models.QuestionOptions,
            as: 'question_options',
            include: [
              {
                model: models.UserQuestionAnsOption,
                as: 'user_question_ans_option',
                where: { user_id },
                required: true,
              },
            ],
          },
          {
            model: models.UserQuestionAns,
            as: 'user_question_ans',
            where: { user_id },
            required: true,
          },
        ],
      });
      const questionData = [];
      getPatientInsuranceData.map(async (value, index) => {
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
        questionData[index] = {
          user_question_ans_id:
            value.user_question_ans !== null
              ? value.user_question_ans.user_question_ans_id
              : 0,
          question_type: value.question_type,
          question_id: value.question_id,
          ans_type,
          ans_value,
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
          'admin.patient_get_insurance_details_success',
          questionData
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientAllOrders
   * @description Get All patient Orders.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getPatientAllOrders(req, res) {
    try {
      const { page, user_id } = req.query;
      const organizationData = await models.Users.findOne({
        where: {
          user_id,
        },
        attributes: ['organation_id'],
      });
      const { docs, pages, total } = await models.Orders.paginate({
        where: {
          user_id,
          order_status: {
            [Op.ne]: 1,
          },
        },
        attributes: ['order_id', 'total_amount', 'order_status', 'created_at'],
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
                model: models.Formulary,
                as: 'formulary',
                require: true,
                attributes: [
                  'name',
                  'featured_image',
                  'short_description',
                  'formulary_id',
                ],
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
        paginate: PaginationLength.getPatientAllOrders(),
      });
      const dataList = [];
      docs.map(async (value, index) => {
        const countIntakeQuestionData = await models.Questions.scope(
          'defaultScope',
          'intakeUserQuestionColumns'
        ).findAll({
          order: [['question_id', 'ASC']],
          where: {
            is_required: 1,
            user_id: organizationData.organation_id,
          },
        });
        const countUserQuestionIntakeData = await models.UserQuestionAns.count({
          where: {
            user_id,
            order_id: value.order_id,
            question_id: {
              [Op.in]: countIntakeQuestionData.map((val) => val.question_id),
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
        data.order_items.map(async (item) => {
          const countQuestionData = await models.Questions.scope(
            'defaultScope',
            'patientformulryUserQuestionColumns'
          ).findAll({
            order: [['question_id', 'ASC']],
            where: {
              is_required: 1,
              formulary_id: item.formulary_id,
              user_id: organizationData.organation_id,
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
        });
        dataList[index] = data;
        return value;
      });
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.patient_get_all_order_transaction_success',
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
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getAllNotes
   * @description Get Organization Order Note Details.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getAllNotes(req, res) {
    try {
      const { user_id } = req.query;
      const orderNoteDetails = await models.OrderNotes.findAll({
        where: {
          user_id,
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
   * @name getPatientChartAllOrders
   * @description Get All patient Order Data Without Pagination.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getPatientChartAllOrders(req, res) {
    try {
      const { user_id } = req.query;
      const organizationData = await models.Users.findOne({
        where: {
          user_id,
        },
        attributes: ['organation_id'],
      });
      const order_deatils = await models.Orders.findAll({
        where: {
          user_id,
          order_status: {
            [Op.ne]: 1,
          },
        },
        attributes: ['order_id', 'total_amount', 'order_status', 'created_at'],
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
                model: models.Formulary,
                as: 'formulary',
                require: true,
                attributes: [
                  'name',
                  'featured_image',
                  'short_description',
                  'formulary_id',
                ],
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
          {
            model: models.Users,
            as: 'users',
            attributes: ['user_id', 'first_name', 'last_name', 'phone'],
          },
        ],
      });
      const dataList = [];
      order_deatils.map(async (value, index) => {
        const countIntakeQuestionData = await models.Questions.scope(
          'defaultScope',
          'intakeUserQuestionColumns'
        ).findAll({
          order: [['question_id', 'ASC']],
          where: {
            is_required: 1,
            user_id: organizationData.organation_id,
          },
        });
        const countUserQuestionIntakeData = await models.UserQuestionAns.count({
          where: {
            user_id,
            order_id: value.order_id,
            question_id: {
              [Op.in]: countIntakeQuestionData.map((val) => val.question_id),
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
        data.order_items.map(async (item) => {
          const countQuestionData = await models.Questions.scope(
            'defaultScope',
            'patientformulryUserQuestionColumns'
          ).findAll({
            order: [['question_id', 'ASC']],
            where: {
              is_required: 1,
              formulary_id: item.formulary_id,
              user_id: organizationData.organation_id,
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
        });
        dataList[index] = data;
        return value;
      });
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.patient_get_all_order_transaction_success',
          {
            order_list: dataList,
          }
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientChatRoomData
   * @description Get patient chat room Data.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getPatientChatRoomData(req, res) {
    try {
      const { user_id } = req.payload.user;
      const patient_user_id = req.query;
      const data = {};
      let user_chat_room_id = '';
      let type = '';
      const chat_room = await models.UserChatRoom.findOne({
        where: {
          user_id: patient_user_id,
          organization_id: user_id,
        },
      });
      if (!chat_room) {
        user_chat_room_id = patient_user_id.patient_user_id;
        type = 'user';
      } else {
        user_chat_room_id = chat_room.user_chat_room_id;
        type = 'room';
      }
      data.user_chat_room_id = user_chat_room_id;
      data.type = type;

      return response.successResponse(
        req,
        res,
        'admin.get_chat_room_data_success',

        data
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new PatientController();
