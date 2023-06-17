const { Op } = require('sequelize');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');
const PaginationLength = require('../../../config/pagination.config');
const FilePath = require('../../../config/upload.config');
const { getFileUrl } = require('../../../helpers/s3file.helper');

class QuestionsController {
  /**
   * @name addQuestions
   * @description Store Questions Data.
   * @param req,res
   * @returns {Json} success
   */
  async addQuestions(req, res) {
    try {
      const {
        label,
        is_required,
        type,
        question_type,
        sequence,
        status,
        question_options,
      } = req.body;
      const storeQuestionsData = await models.Questions.create(
        {
          label,
          is_required,
          type,
          question_type,
          sequence,
          status,
          created_by: 2,
          question_options,
        },
        {
          include: [
            {
              model: models.QuestionOptions,
              as: 'question_options',
            },
          ],
        }
      );
      return response.successResponse(
        req,
        res,
        'admin.create_question_success',
        {
          question_id: storeQuestionsData.question_id,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name editQuestions
   * @description Update Questions Data.
   * @param req,res
   * @returns {Json} success
   */
  async editQuestions(req, res) {
    try {
      const {
        question_id,
        label,
        is_required,
        type,
        question_type,
        sequence,
        status,
        question_options,
      } = req.body;
      const getQuestionsData = await models.Questions.findOne({
        where: {
          question_id,
        },
      });
      if (getQuestionsData) {
        if (getQuestionsData.type !== type) {
          throw new Error('admin.update_question_not_change_question_type');
        }
        if (getQuestionsData.question_type !== question_type) {
          throw new Error('admin.update_question_not_change_question_type');
        }
      } else {
        throw new Error('admin.update_question_not_found');
      }
      const updateQuestionsData = await models.Questions.update(
        {
          label,
          is_required,
          type,
          question_type,
          sequence,
          status,
        },
        {
          where: {
            question_id,
          },
        }
      );
      if (updateQuestionsData) {
        Object.keys(question_options).map(async (key) => {
          const option_values = question_options[key];
          await models.QuestionOptions.findOne({
            where: {
              question_option_id: option_values.question_option_id,
            },
          }).then(async (obj) => {
            // update
            if (
              obj &&
              option_values.is_delete === 1 &&
              option_values.is_new === 1
            ) {
              return obj.update({
                option_value: option_values.option_value,
              });
            }
            if (
              obj &&
              option_values.is_delete === 2 &&
              option_values.is_new === 1
            ) {
              const checkOptionValue = await models.UserQuestionAnsOption.count(
                {
                  where: {
                    question_option_id: option_values.question_option_id,
                  },
                }
              );
              if (checkOptionValue === 0) {
                return obj.destroy();
              }
            }
            if (option_values.is_delete === 1 && option_values.is_new === 2) {
              // insert
              return models.QuestionOptions.create({
                option_value: option_values.option_value,
                question_id,
              });
            }
            return null;
          });
        });
      }
      return response.successResponse(
        req,
        res,
        'admin.update_question_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getQuestions
   * @description Get Questions Data.
   * @param req,res
   * @returns {Json} success
   */
  async getQuestions(req, res) {
    try {
      const { question_id } = req.query;
      const getQuestionsData = await models.Questions.findOne({
        where: {
          question_id,
        },
        include: [{ model: models.QuestionOptions, as: 'question_options' }],
      });
      return response.successResponse(
        req,
        res,
        'admin.get_question_success',
        getQuestionsData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name updateStatusQuestions
   * @description Update Status of Questions.
   * @param req,res
   * @returns {Json} success
   */
  async updateStatusQuestions(req, res) {
    try {
      const { question_id } = req.body;
      const getQuestionsData = await models.Questions.findOne({
        where: {
          question_id,
        },
      });
      if (getQuestionsData) {
        await models.Questions.update(
          {
            status: getQuestionsData.status === 1 ? 2 : 1,
          },
          {
            where: {
              question_id,
            },
          }
        );
        return response.successResponse(
          req,
          res,
          'admin.update_status_question_success'
        );
      }
      return response.successResponse(
        req,
        res,
        'admin.update_status_question_success_not'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name deleteQuestions
   * @description delete Questions Data.
   * @param req,res
   * @returns {Json} success
   */
  async deleteQuestions(req, res) {
    try {
      const { question_id } = req.params;
      await models.Questions.destroy({
        where: {
          question_id,
        },
      });

      return response.successResponse(
        req,
        res,
        'admin.delete_question_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name listQuestions
   * @description Get All Questions Data.
   * @param req,res
   * @returns {Json} success
   */
  async listQuestions(req, res) {
    try {
      const {
        page,
        serach_text,
        status,
        type,
        question_type,
        from_date,
        to_date,
      } = req.query;
      const wherecondition = [];
      wherecondition.push({
        created_by: 2,
      });
      wherecondition.push({
        [Op.or]: {
          label: {
            [Op.like]: `%${serach_text}%`,
          },
        },
      });

      const condition = {
        attributes: [
          'question_id',
          'label',
          'type',
          'status',
          'question_type',
          'created_at',
        ],
      };
      if (status !== '') {
        wherecondition.push({
          status,
        });
      }
      if (type !== '') {
        wherecondition.push({
          type,
        });
      }
      if (question_type !== '') {
        wherecondition.push({
          question_type,
        });
      }
      if (from_date) {
        const start_date_time = `${from_date}T00:00:00.000Z`;
        wherecondition.push({
          created_at: {
            [Op.gte]: start_date_time,
          },
        });
      }
      if (to_date) {
        const end_date_time = `${to_date}T23:59:00.000Z`;
        wherecondition.push({
          created_at: {
            [Op.lte]: end_date_time,
          },
        });
      }
      condition.where = wherecondition;
      condition.page = page;
      condition.paginate = PaginationLength.getQuestions();
      condition.order = [['question_id', 'DESC']];
      const { docs, pages, total } = await models.Questions.paginate(condition);
      return response.successResponse(req, res, 'admin.get_question_success', {
        pagination: {
          total,
          count: docs.length,
          current_page: page,
          last_page: pages,
          per_page: PaginationLength.getQuestions(),
          hasMorePages: pages > parseInt(page, 10),
        },
        question_list: docs,
      });
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationBusinessQuestionDetails
   * @description Get organization Business Question Details
   * @param req,res
   * @return {Json} success
   */
  async getOrganizationBusinessQuestionDetails(req, res) {
    try {
      const { user_id } = req.query;
      const getOrganizationBusinessQuestionData =
        await models.UserQuestionAns.findAll({
          where: {
            user_id,
          },
          include: [
            {
              model: models.UserQuestionAnsOption,
              as: 'user_question_ans_option',
              include: [
                {
                  model: models.QuestionOptions,
                  as: 'question_options',
                  require: false,
                },
              ],
            },
            {
              model: models.Questions,
              as: 'questions',
              require: false,
            },
          ],
        });
      const QuestionData = [];
      if (getOrganizationBusinessQuestionData) {
        getOrganizationBusinessQuestionData.map(async (value) => {
          const datareturn = value.dataValues;
          datareturn.ans_type = value.ans_type;
          datareturn.questions = value.questions.dataValues;
          datareturn.questions.status = value.questions.status;
          datareturn.questions.is_required = value.questions.is_required;
          datareturn.questions.type = value.questions.type;
          datareturn.questions.question_type = value.questions.question_type;
          datareturn.questions.is_required = value.questions.is_required;
          if (value.questions !== null && value.questions.question_type === 6) {
            let folder_path = '';
            const fileFolderPath = FilePath.getFolderConfig().ans_value_image;
            folder_path = fileFolderPath.file_path.replace(
              fileFolderPath.replace,
              value.user_question_ans_id
            );
            folder_path += value.ans_value;
            datareturn.ans_value = await getFileUrl(`${folder_path}`).then(
              (dataUrl) => dataUrl
            );
          }
          QuestionData.push(datareturn);
          return datareturn;
        });
      }
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.organization_business_question_get_success',
          QuestionData
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationIntakeQuestionsDetails
   * @description Get organization Intake Question Details
   * @param req,res
   * @return {Json} success
   */
  async getOrganizationIntakeQuestionsDetails(req, res) {
    try {
      const { user_id } = req.query;
      const conditions = {
        order: [['question_id', 'ASC']],
        include: [
          {
            model: models.QuestionOptions.scope('defaultScope'),
            as: 'question_options',
          },
        ],
      };
      const getOrganizationIntakeQuestionsData = await models.Questions.scope(
        'defaultScope',
        'intakeUserQuestionColumns'
      ).findAll({ ...conditions, where: { user_id } });
      return response.successResponse(
        req,
        res,
        'admin.get_organization_intake_question_success',
        getOrganizationIntakeQuestionsData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientSignupQuestionsDetails
   * @description Get All Patient General Questions Details
   * @param req,res
   * @returns {Json} success
   */
  async getPatientSignupQuestionsDetails(req, res) {
    try {
      const { question_id } = req.query;
      const conditions = {
        order: [['question_id', 'ASC']],
        include: [
          {
            model: models.QuestionOptions.scope('defaultScope'),
            as: 'question_options',
          },
        ],
      };
      const getPatientSignupQuestionsData = await models.Questions.scope(
        'defaultScope',
        'patientSignupQuestionsDetails'
      ).findAll({ ...conditions, where: { question_id } });
      return response.successResponse(
        req,
        res,
        'admin.get_patient_signup_questions_details_success',
        getPatientSignupQuestionsData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientInsuranceQuestionsDetails
   * @description Get All Patient Insurance Questions Details
   * @param req,res
   * @returns {Json} success
   */
  async getPatientInsuranceQuestionsDetails(req, res) {
    try {
      const { question_id } = req.query;
      const conditions = {
        order: [['question_id', 'ASC']],
        include: [
          {
            model: models.QuestionOptions.scope('defaultScope'),
            as: 'question_options',
          },
        ],
      };
      const getPatientGeneralQuestionsData = await models.Questions.scope(
        'defaultScope',
        'patientInsuranceQuestionsDetails'
      ).findAll({ ...conditions, where: { question_id } });
      return response.successResponse(
        req,
        res,
        'admin.get_patient_insurance_questions_details_success',
        getPatientGeneralQuestionsData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name deleteQuestion
   * @description Question Delete API
   * @param req
   * @param res
   * @returns success
   */
  async deleteQuestion(req, res) {
    try {
      const { question_id } = req.query;
      const getQuestionData = await models.UserQuestionAns.findOne({
        where: {
          question_id,
        },
      });
      if (getQuestionData) {
        throw new Error('admin.question_already_use');
      } else {
        await models.Questions.destroy({
          where: {
            question_id,
          },
        });
        await models.QuestionOptions.destroy({
          where: {
            question_id,
          },
        });
      }
      return response.successResponse(
        req,
        res,
        'admin.question_delete_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new QuestionsController();
