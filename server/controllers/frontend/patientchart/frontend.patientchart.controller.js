const { Op } = require('sequelize');
const models = require('../../../models/index');
const response = require('../../../helpers/response.helper');
const FilePath = require('../../../config/upload.config');
const { getFileUrl } = require('../../../helpers/s3file.helper');
const PaginationLength = require('../../../config/pagination.config');

class PatientChartController {
  /**
   * @name getPatientChartGeneralDetails
   * @description Get All Patient General Details
   * @param req,res
   * @returns {Json} success
   */
  async getPatientChartGeneralDetails(req, res) {
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
      const QuestionData = [];
      getPatientGeneralData.map(async (value, index) => {
        let ans_type = 1;
        let ans_value =
          value.user_question_ans !== null
            ? value.user_question_ans.ans_value
            : '';
        if (value.question_type === 8) {
          const { name } = await models.States.findOne({
            where: {
              state_id: value.user_question_ans.ans_value,
            },
          });
          ans_value = name;
        }
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
          // ans_value = moment(value.ans_value).format('YYYY-MM-DD');
        } else if ([3, 4, 5].includes(value.question_type)) {
          ans_type = 2;
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
          'admin.get_patient_chart_general_details_success',
          QuestionData
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientChartInsuranceDetails
   * @description Get All Patient Insurance Details
   * @param req,res
   * @returns {Json} success
   */
  async getPatientChartInsuranceDetails(req, res) {
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
          'admin.get_patient_chart_insurance_details_success',
          questionData
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientChartAllOrderDetails
   * @description Get All patient Order Data.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getPatientChartAllOrderDetails(req, res) {
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
          {
            model: models.Users,
            as: 'users',
            attributes: ['user_id', 'first_name', 'last_name', 'phone'],
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
   * @name getPatientOrderNote
   * @description  get All Patient Order Note Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getPatientOrderNote(req, res) {
    try {
      const { user_id } = req.query;

      const getPatientOrderNoteData = await models.OrderNotes.findAll({
        where: {
          user_id,
        },
        order: [['order_note_id', 'DESC']],
      });
      return response.successResponse(
        req,
        res,
        'admin.get_patient_order_note_success',
        getPatientOrderNoteData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientDetails
   * @description  get Patient Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getPatientDetails(req, res) {
    try {
      const { user_id } = req.query;

      const getPatientDetails = await models.Users.findOne({
        where: {
          user_id,
        },
        attributes: [
          'user_id',
          'first_name',
          'last_name',
          'phone',
          'profile_image',
          'organation_id',
        ],
      });
      const { company_name } = await models.OrganizationInfo.findOne({
        where: {
          user_id: getPatientDetails.organation_id,
        },
      });
      const patientData = { ...getPatientDetails.dataValues };
      patientData.profile_image = await getPatientDetails.profile_image.then(
        (data) => data
      );
      patientData.company_name = company_name;
      return response.successResponse(
        req,
        res,
        'admin.get_patient_order_note_success',
        patientData
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
}
module.exports = new PatientChartController();
