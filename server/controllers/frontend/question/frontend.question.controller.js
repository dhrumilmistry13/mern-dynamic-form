const { Op } = require('sequelize');
const validUrl = require('valid-url');
const response = require('../../../helpers/response.helper');
const {
  uploadBase64File,
  getFileUrl,
  copyUploedFile,
} = require('../../../helpers/s3file.helper');
const models = require('../../../models/index');
const FilePath = require('../../../config/upload.config');

class QuestionsController {
  /**
   * @name getBusinessQuestions
   * @description Get All Business Questions Data.
   * @param req,res
   * @returns {Json} success
   */
  async getBusinessQuestions(req, res) {
    try {
      const getBusinessQuestionsData = await models.Questions.scope(
        'defaultScope',
        'businessQuestionColumns'
      ).findAll({
        order: [
          ['sequence', 'ASC'],
          ['label', 'ASC'],
        ],
        include: [
          {
            model: models.QuestionOptions.scope('defaultScope'),
            as: 'question_options',
          },
        ],
      });
      return response.successResponse(
        req,
        res,
        'admin.get_question_success',
        getBusinessQuestionsData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name storeBusinessQuestionsAns
   * @description Store Business Questions Ans Data.
   * @param req,res
   * @returns {Json} success
   */
  async storeBusinessQuestionsAns(req, res) {
    try {
      const { answers } = req.body;
      const { organization_id } = req.payload.user;
      Object.values(answers).map(async (item) => {
        item.user_id = organization_id;
        item.organation_id = organization_id;
        const random = Math.floor(100000 + Math.random() * 900000);
        const type = item.ans_value.split(';')[0].split('/')[1];
        const filename = `${Date.now()}_${random}.${type}`;
        if (
          item.question_type === 6 &&
          item.is_new === 2 &&
          item.user_question_ans_id !== 0 &&
          item.ans_value !== ''
        ) {
          let folder_path = '';
          const fileFolderPath = FilePath.getFolderConfig().ans_value_image;
          folder_path = fileFolderPath.file_path.replace(
            fileFolderPath.replace,
            item.user_question_ans_id
          );
          folder_path += filename;
          await uploadBase64File(item.ans_value, folder_path);
          item.ans_value = filename;
        }
        item.user_question_ans_option = item.user_question_ans_option.map(
          (value) => ({
            option_value: value.option_value,
            question_option_id: value.question_option_id,
            is_delete: value.is_delete,
            is_new: value.is_new,
            user_question_ans_option_id: value.user_question_ans_option_id,
            user_id: organization_id,
            organation_id: organization_id,
          })
        );

        await models.UserQuestionAns.findOne({
          where: {
            user_question_ans_id: item.user_question_ans_id,
          },
        }).then(async (obj) => {
          // update
          if (
            obj &&
            item.is_delete === 1 &&
            item.is_new === 2 &&
            item.user_question_ans_id !== 0
          ) {
            if (
              item.user_question_ans_option !== null &&
              item.user_question_ans_option.length > 0
            ) {
              Object.keys(item.user_question_ans_option).map(async (key) => {
                const option_values = item.user_question_ans_option[key];
                option_values.user_id = organization_id;
                option_values.organation_id = organization_id;
                await models.UserQuestionAnsOption.findOne({
                  where: {
                    user_question_ans_option_id:
                      option_values.user_question_ans_option_id,
                  },
                }).then(async (objo) => {
                  // update
                  if (objo && option_values.is_delete === 1) {
                    return objo.update({
                      question_option_id: option_values.question_option_id,
                      option_value: option_values.option_value,
                    });
                  }
                  if (
                    objo &&
                    option_values.is_delete === 2 &&
                    option_values.is_new === 1
                  ) {
                    return objo.destroy();
                  }
                  if (
                    (option_values.is_delete === 1 &&
                      option_values.is_new === 2) ||
                    option_values.user_question_ans_option_id === 0
                  ) {
                    // insert
                    return models.UserQuestionAnsOption.create({
                      user_question_ans_id: item.user_question_ans_id,
                      option_value: option_values.option_value,
                      question_id: item.question_id,
                      question_option_id: option_values.question_option_id,
                      user_id: organization_id,
                      organation_id: organization_id,
                    });
                  }
                  return null;
                });
              });
            }
            return obj.update(item);
          }

          if (obj && item.is_delete === 2 && item.is_new === 1) {
            await models.UserQuestionAnsOption.destroy({
              where: {
                user_question_ans_id: item.user_question_ans_id,
              },
            });
            return obj.destroy();
          }
          if (
            (item.is_delete === 1 && item.is_new === 2) ||
            (item.user_question_ans_id === 0 && item.ans_value !== '')
          ) {
            item.user_question_ans_option = item.user_question_ans_option.map(
              (value) => ({
                option_value: value.option_value,
                question_option_id: value.question_option_id,
                user_id: organization_id,
                organation_id: organization_id,
              })
            );
            // insert
            let fileContent = '';
            if (item.question_type === 6) {
              fileContent = item.ans_value;
              item.ans_value = filename;
            }
            const data = await models.UserQuestionAns.create(item, {
              include: [
                {
                  model: models.UserQuestionAnsOption,
                  as: 'user_question_ans_option',
                },
              ],
            });
            if (item.question_type === 6) {
              let folder_path = '';
              const fileFolderPath = FilePath.getFolderConfig().ans_value_image;
              folder_path = fileFolderPath.file_path.replace(
                fileFolderPath.replace,
                data.user_question_ans_id
              );
              folder_path += filename;
              await uploadBase64File(fileContent, folder_path);
              item.ans_value = filename;
              data.update(item);
            }
          }

          return null;
        });
      });
      const organizationData = {
        user_id: organization_id,
        fill_step: 4,
      };
      await models.OrganizationInfo.findOne({
        where: {
          user_id: organization_id,
        },
      }).then(async (obj) => {
        // update
        if (obj) {
          const updateOrganizationInfoData = obj.update(organizationData);
          return updateOrganizationInfoData;
        }

        // insert
        return models.OrganizationInfo.create(organizationData);
      });
      return response.successResponse(
        req,
        res,
        'admin.store_business_question_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getBusinessQuestionsAns
   * @description Get Business Questions Ans Data.
   * @param req,res
   * @returns {Json} success
   */
  async getBusinessQuestionsAns(req, res) {
    try {
      const { organization_id } = req.payload.user;
      const getBusinessQuestionsData = await models.Questions.scope(
        'defaultScope',
        'businessQuestionColumns'
      ).findAll({
        order: [['question_id', 'DESC']],
        include: [
          {
            model: models.QuestionOptions,
            as: 'question_options',
            include: [
              {
                model: models.UserQuestionAnsOption,
                as: 'user_question_ans_option',
                where: { user_id: organization_id },
                required: false,
              },
            ],
          },
          {
            model: models.UserQuestionAns,
            as: 'user_question_ans',
            where: { user_id: organization_id },
            required: false,
          },
        ],
      });
      const QuestionData = [];
      getBusinessQuestionsData.map(async (value, index) => {
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
        }
        QuestionData[index] = {
          user_question_ans_id:
            value.user_question_ans !== null
              ? value.user_question_ans.user_question_ans_id
              : 0,
          question_type: value.question_type,
          question_id: value.question_id,
          ans_value,
          ans_type: 1,
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
          'admin.get_business_question_ans_success',
          QuestionData
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getIntakeQuestions
   * @description Get All Intake Questions Data.
   * @param req,res
   * @returns {Json} success
   */
  async getIntakeQuestions(req, res) {
    try {
      const { organization_id } = req.payload.user;
      const conditions = {
        include: [
          {
            model: models.QuestionOptions.scope('defaultScope'),
            as: 'question_options',
          },
        ],
      };
      const userintakeData = await models.Questions.scope(
        'defaultScope',
        'intakeUserQuestionColumns'
      ).findAll({
        where: {
          user_id: organization_id,
        },
        paranoid: false,
      });
      let deletedIntakeData;
      if (userintakeData && userintakeData.length > 0) {
        deletedIntakeData = userintakeData
          .filter(
            (val) => val.old_question_id !== 0 && val.old_question_id !== null
          )
          .map((d) => d.old_question_id);
      }
      const getOrgIntakeCount = await models.Questions.count({
        where: {
          user_id: organization_id,
          old_question_id: {
            [Op.ne]: null,
          },
        },
        paranoid: false,
      });
      const getAdminIntakeCount = await models.Questions.count({
        where: {
          type: 1,
          created_by: 2,
          deleted_at: null,
          status: 1,
        },
      });
      let getUserIntakeQuestionsData = await models.Questions.scope(
        'defaultScope',
        'intakeUserQuestionColumns'
      ).findAll({
        ...conditions,
        where: {
          user_id: organization_id,
        },
        order: [['question_id', 'ASC']],
      });
      if (getOrgIntakeCount < getAdminIntakeCount) {
        const getAdminIntakeQuestionsData = await models.Questions.scope(
          'defaultScope',
          'intakeAdminQuestionColumns'
        ).findAll({
          ...conditions,
          order: [
            ['sequence', 'ASC'],
            ['label', 'ASC'],
          ],
        });
        let userData;
        if (
          getAdminIntakeQuestionsData &&
          getAdminIntakeQuestionsData.length > 0
        ) {
          if (deletedIntakeData && deletedIntakeData.length > 0) {
            userData = getAdminIntakeQuestionsData
              .map((d) => {
                if (!deletedIntakeData.includes(d.question_id)) {
                  return d;
                }
                return 0;
              })
              .filter((value) => value !== 0);
            getUserIntakeQuestionsData =
              getUserIntakeQuestionsData.concat(userData);
          } else
            getUserIntakeQuestionsData = getUserIntakeQuestionsData.concat(
              getAdminIntakeQuestionsData
            );
        }
      }
      return response.successResponse(
        req,
        res,
        'admin.get_question_success',
        getUserIntakeQuestionsData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name storeIntakeQuestionAsDeleted
   * @description Store Intake Questions as deleted value.
   * @param req,res
   * @returns {Json} success
   */

  async storeIntakeQuestionAsDeleted(req, res) {
    try {
      const { questions } = req.body;
      const { organization_id } = req.payload.user;
      Object.values(questions).map(async (item) => {
        item.user_id = organization_id;
        await models.Questions.findOne({
          where: {
            question_id: item.question_id,
          },
        }).then(async () => {
          if (item.is_delete === 2 && item.is_new === 1) {
            // insert as deleted value
            const addedQuestion = await models.Questions.create(item, {
              include: [
                {
                  model: models.QuestionOptions,
                  as: 'question_options',
                },
              ],
            });
            if (
              addedQuestion &&
              (addedQuestion.question_id !== '' ||
                addedQuestion.question_id !== 0)
            ) {
              await models.QuestionOptions.destroy({
                where: {
                  question_id: addedQuestion.question_id,
                },
                paranoid: false,
              });
              return addedQuestion.destroy();
            }
          }
          return null;
        });
      });
      return response.successResponse(
        req,
        res,
        'admin.store_intake_question_as_deleted_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name storeUpdateIntakeQuestions
   * @description Store and Update Intake Questions Data.
   * @param req,res
   * @returns {Json} success
   */
  async storeUpdateIntakeQuestions(req, res) {
    try {
      const { questions } = req.body;
      const { organization_id } = req.payload.user;
      const organizationData = {
        user_id: organization_id,
        fill_step: 6,
      };
      await models.OrganizationInfo.update(organizationData, {
        where: {
          user_id: organization_id,
        },
      });
      Object.values(questions).map(async (item) => {
        item.user_id = organization_id;
        await models.Questions.findOne({
          where: {
            question_id: item.question_id,
          },
        }).then(async (obj) => {
          // update
          if (obj && item.is_delete === 1 && item.is_new === 1) {
            Object.keys(item.question_options).map(async (key) => {
              const option_values = item.question_options[key];
              await models.QuestionOptions.findOne({
                where: {
                  question_option_id: option_values.question_option_id,
                },
              }).then(async (objo) => {
                // update
                if (
                  objo &&
                  option_values.is_delete === 1 &&
                  option_values.is_new === 1
                ) {
                  return objo.update({
                    option_value: option_values.option_value,
                  });
                }
                if (
                  objo &&
                  option_values.is_delete === 2 &&
                  option_values.is_new === 1
                ) {
                  return objo.destroy();
                }
                if (
                  option_values.is_delete === 1 &&
                  option_values.is_new === 2
                ) {
                  // insert
                  return models.QuestionOptions.create({
                    option_value: option_values.option_value,
                    question_id: item.question_id,
                  });
                }
                return null;
              });
            });
            return obj.update(item);
          }
          if (obj && item.is_delete === 2 && item.is_new === 1) {
            await models.QuestionOptions.destroy({
              where: {
                question_id: item.question_id,
              },
            });
            return obj.destroy();
          }
          if (item.is_delete === 1 && item.is_new === 2) {
            // insert
            return models.Questions.create(item, {
              include: [
                {
                  model: models.QuestionOptions,
                  as: 'question_options',
                },
              ],
            });
          }
          return null;
        });
      });
      return response.successResponse(
        req,
        res,
        'admin.store_intake_question_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name deleteIntakeQuestions
   * @description Delete Intake Questions Data.
   * @param req,res
   * @returns {Json} success
   */
  async deleteIntakeQuestions(req, res) {
    try {
      const { question_id, type } = req.query;
      if (type === 'question') {
        const getQustionData = await models.Questions.findOne({
          where: { question_id },
        });
        getQustionData.destroy();
        const getQuestionOptionData = await models.QuestionOptions.findOne({
          where: { question_id },
        });
        if (getQuestionOptionData) {
          getQuestionOptionData.destroy();
        }
      } else {
        const getQuestionOptionData = await models.QuestionOptions.findOne({
          where: { question_option_id: question_id },
        });
        if (getQuestionOptionData) {
          getQuestionOptionData.destroy();
        }
      }
      return response.successResponse(
        req,
        res,
        type === 'question'
          ? 'admin.delete_intake_question_success'
          : 'admin.delete_intake_question_option_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getFormulryQuestions
   * @description Get Formulry Questions Data.
   * @param req,res
   * @returns {Json} success
   */
  async getFormulryQuestions(req, res) {
    try {
      const { formulary_id } = req.query;
      const { organization_id } = req.payload.user;
      const conditions = {
        order: [['question_id', 'ASC']],
        where: { user_id: organization_id, formulary_id },
        include: [
          {
            model: models.QuestionOptions.scope('defaultScope'),
            as: 'question_options',
          },
        ],
      };
      const getUserFromularyQuestionsData = await models.Questions.scope(
        'defaultScope',
        'formulryUserQuestionColumns'
      ).findAll(conditions);
      return response.successResponse(
        req,
        res,
        'admin.get_question_success',
        getUserFromularyQuestionsData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name storeUpdateMedicationQuestions
   * @description Store and Update Formulry Medication Questions Data.
   * @param req,res
   * @returns {Json} success
   */
  async storeUpdateMedicationQuestions(req, res) {
    try {
      const { questions } = req.body;
      const { organization_id } = req.payload.user;
      Object.values(questions).map(async (item) => {
        item.user_id = organization_id;
        item.type = 3;
        return models.Questions.findOne({
          where: {
            question_id: item.question_id,
          },
        }).then(async (obj) => {
          // update
          if (obj && item.is_delete === 1 && item.is_new === 1) {
            Object.keys(item.question_options).map(async (key) => {
              const option_values = item.question_options[key];
              await models.QuestionOptions.findOne({
                where: {
                  question_option_id: option_values.question_option_id,
                },
              }).then(async (objo) => {
                // update
                if (
                  objo &&
                  option_values.is_delete === 1 &&
                  option_values.is_new === 1
                ) {
                  return objo.update({
                    option_value: option_values.option_value,
                  });
                }
                if (
                  objo &&
                  option_values.is_delete === 2 &&
                  option_values.is_new === 1
                ) {
                  return objo.destroy();
                }
                if (
                  option_values.is_delete === 1 &&
                  option_values.is_new === 2
                ) {
                  // insert
                  return models.QuestionOptions.create({
                    option_value: option_values.option_value,
                    question_id: item.question_id,
                  });
                }
                return null;
              });
            });
            return obj.update(item);
          }

          if (obj && item.is_delete === 2 && item.is_new === 1) {
            await models.QuestionOptions.destroy({
              where: {
                question_id: item.question_id,
              },
            });
            return obj.destroy();
          }
          if (item.is_delete === 1 && item.is_new === 2) {
            // insert
            return models.Questions.create(item, {
              include: [
                {
                  model: models.QuestionOptions,
                  as: 'question_options',
                },
              ],
            });
          }
          return null;
        });
      });
      return response.successResponse(
        req,
        res,
        'admin.store_madication_question_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name deleteMedicationQuestions
   * @description Delete Medication Questions.
   * @param req,res
   * @returns {Json} success
   */
  async deleteMedicationQuestions(req, res) {
    try {
      const { question_id, type } = req.query;
      if (type === 'question') {
        const getQustionData = await models.Questions.findOne({
          where: { question_id },
        });
        getQustionData.destroy();
        const getQuestionOptionData = await models.QuestionOptions.findOne({
          where: { question_id },
        });
        if (getQuestionOptionData) {
          getQuestionOptionData.destroy();
        }
      } else {
        const getQuestionOptionData = await models.QuestionOptions.findOne({
          where: { question_option_id: question_id },
        });
        if (getQuestionOptionData) {
          getQuestionOptionData.destroy();
        }
      }
      return response.successResponse(
        req,
        res,
        type === 'question'
          ? 'admin.delete_medication_question_success'
          : 'admin.delete_medication_question_option_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getFormulryQuestionnairy
   * @description Get Formulry Questions Data.
   * @param req,res
   * @returns {Json} success
   */
  async getFormulryQuestionnair(req, res) {
    try {
      const { formulary_id } = req.query;
      const { organization_id } = req.payload.user;
      const conditions = {
        order: [['question_id', 'ASC']],
        where: {
          user_id: { [Op.not]: organization_id },
          formulary_id,
        },
        include: [
          {
            model: models.QuestionOptions.scope('defaultScope'),
            as: 'question_options',
          },
        ],
      };
      const getUserFormularyQuestionData = await models.Questions.findAll({
        attributes: {
          include: ['old_question_id'],
        },
        order: [['question_id', 'ASC']],
        where: { user_id: organization_id },
      });
      if (getUserFormularyQuestionData) {
        const old_question_id = getUserFormularyQuestionData
          .map((value) => value.old_question_id)
          .filter(
            (value, index, self) =>
              value !== null && self.indexOf(value) === index
          );
        if (old_question_id) {
          conditions.where = {
            user_id: { [Op.not]: organization_id },
            formulary_id,
            old_question_id: {
              [Op.is]: null,
            },
            question_id: {
              [Op.notIn]: old_question_id,
            },
          };
        }
      }
      const getUserFromularyQuestionsData = await models.Questions.scope(
        'defaultScope',
        'formulryUserQuestionColumns'
      ).findAll(conditions);
      return response.successResponse(
        req,
        res,
        'admin.get_question_success',
        getUserFromularyQuestionsData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getFormulryPatientQuestion
   * @description Get Formulry Questions Data for patient.
   * @param req,res
   * @returns {Json} success
   */
  async getFormulryPatientQuestion(req, res) {
    try {
      const { formulary_id, order_id } = req.query;
      const { user_id } = req.payload.user;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      let old_order_id = order_id;
      const getQuestionData = await models.Questions.scope(
        'defaultScope',
        'intakeUserQuestionColumns'
      ).findAll({ where: { user_id: organizationData.user_id } });
      const countUserAnsData = await models.UserQuestionAns.count({
        where: { user_id, order_id },
      });
      if (countUserAnsData === 0 && getQuestionData.length !== 0) {
        const oldOrderData = await models.Orders.findOne({
          order: [['order_id', 'DESC']],
          where: {
            user_id,
            organization_id: organizationData.user_id,
            payment_status: 1,
          },
        });
        if (oldOrderData) {
          old_order_id = oldOrderData.order_id;
        }
      }
      const geFormulartQuestionsData = await models.Questions.scope(
        'defaultScope',
        'patientformulryUserQuestionColumns'
      ).findAll({
        order: [['question_id', 'ASC']],
        where: { formulary_id, user_id: organizationData.user_id },
        include: [
          {
            model: models.QuestionOptions,
            as: 'question_options',
            include: [
              {
                model: models.UserQuestionAnsOption,
                as: 'user_question_ans_option',
                where: { user_id, order_id: old_order_id },
                required: false,
              },
            ],
          },
          {
            model: models.UserQuestionAns,
            as: 'user_question_ans',
            where: { user_id, order_id: old_order_id },
            required: false,
          },
        ],
      });
      const QuestionData = [];
      geFormulartQuestionsData.map(async (value, index) => {
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
        }
        QuestionData[index] = {
          user_question_ans_id:
            value.user_question_ans !== null && order_id === old_order_id
              ? value.user_question_ans.user_question_ans_id
              : 0,
          question_type: value.question_type,
          question_id: value.question_id,
          ans_value,
          ans_type: 1,
          type:
            value.question_type === 6 &&
            value.user_question_ans !== null &&
            order_id === old_order_id
              ? 1
              : 2,
          label: value.label,
          is_required: value.is_required,
          question_text:
            value.user_question_ans !== null
              ? value.user_question_ans.question_text
              : '',
          is_delete: 1,
          is_new: order_id === old_order_id ? 1 : 2,
          user_question_ans_option: value.question_options.map((item) => ({
            user_question_ans_option_id:
              item.user_question_ans_option !== null &&
              order_id === old_order_id
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
          'admin.get_formulary_question_ans_success',
          QuestionData
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name storeFormularyPatientQuestionsAns
   * @description Store FormularyPatient Questions Ans Data.
   * @param req,res
   * @returns {Json} success
   */
  async storeFormularyPatientQuestionsAns(req, res) {
    try {
      const { answers } = req.body;
      const { user_id } = req.payload.user;
      const { subdomain } = req.headers;
      const getOrganizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      Object.values(answers).map(async (item) => {
        item.user_id = user_id;
        item.organation_id = getOrganizationData.user_id;
        let filename = '';
        const random = Math.floor(100000 + Math.random() * 900000);
        let folder_path_old = [];
        if (
          item.question_type === 6 &&
          item.is_new === 2 &&
          item.user_question_ans_id !== 0 &&
          item.ans_value !== '' &&
          item.type === 1
        ) {
          let folder_path = '';
          const fileFolderPath = FilePath.getFolderConfig().ans_value_image;
          folder_path = fileFolderPath.file_path.replace(
            fileFolderPath.replace,
            item.user_question_ans_id
          );
          const type = item.ans_value.split(';')[0].split('/')[1];
          filename = `${Date.now()}_${random}.${type}`;
          folder_path += filename;
          await uploadBase64File(item.ans_value, folder_path);
          item.ans_value = filename;
        }
        item.user_question_ans_option = item.user_question_ans_option.map(
          (value) => ({
            order_id: value.order_id,
            option_value: value.option_value,
            question_option_id: value.question_option_id,
            is_delete: value.is_delete,
            is_new: value.is_new,
            user_question_ans_option_id: value.user_question_ans_option_id,
            user_id,
            organation_id: getOrganizationData.user_id,
          })
        );

        await models.UserQuestionAns.findOne({
          where: {
            user_question_ans_id: item.user_question_ans_id,
          },
        }).then(async (obj) => {
          // update
          if (
            obj &&
            item.is_delete === 1 &&
            item.is_new === 2 &&
            item.user_question_ans_id !== 0
          ) {
            if (
              item.user_question_ans_option !== null &&
              item.user_question_ans_option.length > 0
            ) {
              Object.keys(item.user_question_ans_option).map(async (key) => {
                const option_values = item.user_question_ans_option[key];
                option_values.user_id = user_id;
                option_values.organation_id = getOrganizationData.user_id;
                await models.UserQuestionAnsOption.findOne({
                  where: {
                    user_question_ans_option_id:
                      option_values.user_question_ans_option_id,
                  },
                }).then(async (objo) => {
                  // update
                  if (objo && option_values.is_delete === 1) {
                    return objo.update({
                      question_option_id: option_values.question_option_id,
                      option_value: option_values.option_value,
                    });
                  }
                  if (
                    objo &&
                    option_values.is_delete === 2 &&
                    option_values.is_new === 1
                  ) {
                    return objo.destroy();
                  }
                  if (
                    (option_values.is_delete === 1 &&
                      option_values.is_new === 2) ||
                    option_values.user_question_ans_option_id === 0
                  ) {
                    // insert
                    return models.UserQuestionAnsOption.create({
                      order_id: option_values.order_id,
                      user_question_ans_id: item.user_question_ans_id,
                      option_value: option_values.option_value,
                      question_id: item.question_id,
                      question_option_id: option_values.question_option_id,
                      user_id,
                      organation_id: getOrganizationData.user_id,
                    });
                  }
                  return null;
                });
              });
            }
            return obj.update(item);
          }

          if (obj && item.is_delete === 2 && item.is_new === 1) {
            await models.UserQuestionAnsOption.destroy({
              where: {
                user_question_ans_id: item.user_question_ans_id,
              },
            });
            return obj.destroy();
          }
          if (
            (item.is_delete === 1 && item.is_new === 2) ||
            (item.user_question_ans_id === 0 && item.ans_value !== '')
          ) {
            item.user_question_ans_option = item.user_question_ans_option.map(
              (value) => ({
                order_id: value.order_id,
                option_value: value.option_value,
                question_option_id: value.question_option_id,
                user_id,
                organation_id: getOrganizationData.user_id,
              })
            );
            // insert
            let fileContent = '';
            if (item.question_type === 6 && item.type === 1) {
              fileContent = item.ans_value;
              item.ans_value = filename;
            }
            const data = await models.UserQuestionAns.create(item, {
              include: [
                {
                  model: models.UserQuestionAnsOption,
                  as: 'user_question_ans_option',
                },
              ],
            });
            if (item.question_type === 6 && item.type === 1) {
              let folder_path = '';
              const fileFolderPath = FilePath.getFolderConfig().ans_value_image;
              folder_path = fileFolderPath.file_path.replace(
                fileFolderPath.replace,
                data.user_question_ans_id
              );
              folder_path += filename;
              await uploadBase64File(fileContent, folder_path);
              item.ans_value = filename;
              data.update(item);
            } else if (item.question_type === 6 && item.type === 2) {
              const pathArray = item.ans_value.split('/');
              const pathArrayHeader =
                pathArray[pathArray.length - 1].split('?');
              const fileFullName =
                pathArrayHeader[pathArrayHeader.length - 2].split('.');

              folder_path_old = item.ans_value
                .replace(process.env.AWS_URL, '')
                .split('?');
              filename = `${Date.now()}_${random}.${fileFullName[1]}`;
              let folder_path = '';
              const fileFolderPath = FilePath.getFolderConfig().ans_value_image;
              folder_path = fileFolderPath.file_path.replace(
                fileFolderPath.replace,
                data.user_question_ans_id
              );
              folder_path += filename;
              await copyUploedFile(
                folder_path_old[0].substring(1),
                folder_path
              );
              item.ans_value = filename;
              data.update(item);
            }
          }

          return null;
        });
      });
      return response.successResponse(
        req,
        res,
        'admin.store_formulary_question_ans_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getCheckOutIntakePatientQuestion
   * @description Get Checkout Intake Questions Data for patient.
   * @param req,res
   * @returns {Json} success
   */
  async getCheckOutIntakePatientQuestion(req, res) {
    try {
      const { order_id } = req.query;
      const { user_id } = req.payload.user;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      let old_order_id = order_id;
      let getorderData = await models.Orders.findOne({
        where: { order_id: old_order_id },
      });
      const document_id = await getorderData.document_id.then(
        (dataUrl) => dataUrl
      );
      const selfi_image = await getorderData.selfi_image.then(
        (dataUrl) => dataUrl
      );
      if (
        order_id === old_order_id &&
        document_id === null &&
        selfi_image === null
      ) {
        const oldOrderData = await models.Orders.findOne({
          order: [['order_id', 'DESC']],
          where: {
            user_id,
            organization_id: organizationData.user_id,
            payment_status: 1,
          },
        });
        if (oldOrderData) {
          getorderData = oldOrderData;
          old_order_id = oldOrderData.order_id;
        }
      }

      const geFormulartQuestionsData = await models.Questions.scope(
        'defaultScope',
        // 'patientCheckoutIntakeUserQuestionColumns',
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
                where: { user_id, order_id: old_order_id },
                required: false,
              },
            ],
          },
          {
            model: models.UserQuestionAns,
            as: 'user_question_ans',
            where: { user_id, order_id: old_order_id },
            required: false,
          },
        ],
      });
      const QuestionData = [];
      geFormulartQuestionsData.map(async (value, index) => {
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
        }
        QuestionData[index] = {
          user_question_ans_id:
            value.user_question_ans !== null && order_id === old_order_id
              ? value.user_question_ans.user_question_ans_id
              : 0,
          question_type: value.question_type,
          question_id: value.question_id,
          ans_value,
          ans_type: 1,
          type:
            value.question_type === 6 &&
            value.user_question_ans !== null &&
            order_id === old_order_id
              ? 1
              : 2,
          label: value.label,
          is_required: value.is_required,
          question_text:
            value.user_question_ans !== null
              ? value.user_question_ans.question_text
              : '',
          is_delete: 1,
          is_new: order_id === old_order_id ? 1 : 2,
          user_question_ans_option: value.question_options.map((item) => ({
            user_question_ans_option_id:
              item.user_question_ans_option !== null &&
              order_id === old_order_id
                ? item.user_question_ans_option.user_question_ans_option_id
                : 0,
            is_delete: 1,
            is_new: item.user_question_ans_option !== null ? 2 : 1,
            question_option_id: item.question_option_id,
            option_value: item.option_value,
          })),
        };
      });

      let orderData = {};
      if (getorderData) {
        orderData = getorderData.dataValues;
        orderData.payout_status = getorderData.payout_status;
        orderData.order_status = getorderData.order_status;
        orderData.payment_status = getorderData.payment_status;
        orderData.document_id = await getorderData.document_id.then(
          (dataUrl) => dataUrl
        );
        orderData.selfi_image = await getorderData.selfi_image.then(
          (dataUrl) => dataUrl
        );
      }

      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.get_checkout_intake_question_ans_success',
          { QuestionData, orderData }
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name storeCheckOutIntakePatientQuestionsAns
   * @description Store CheckOut Intake Patient Questions Ans Data.
   * @param req,res
   * @returns {Json} success
   */
  async storeCheckOutIntakePatientQuestionsAns(req, res) {
    try {
      const { answers, document_id, selfi_image, order_id } = req.body;
      const { user_id } = req.payload.user;
      const { subdomain } = req.headers;
      const random = Math.floor(100000 + Math.random() * 900000);
      const getOrganizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      if (selfi_image) {
        if (!validUrl.isWebUri(selfi_image)) {
          const type = selfi_image.split(';')[0].split('/')[1];
          const filename = `${Date.now()}_${random}.${type}`;
          let folder_pathself = '';
          const fileFolderPath = FilePath.getFolderConfig().selfi_image;
          folder_pathself = fileFolderPath.file_path.replace(
            fileFolderPath.replace,
            order_id
          );
          folder_pathself += filename;
          await uploadBase64File(selfi_image, folder_pathself);
          await models.Orders.update(
            { selfi_image: filename },
            {
              where: {
                order_id,
              },
            }
          );
        } else {
          const pathArray = selfi_image.split('/');
          if (pathArray[pathArray.length - 2] !== order_id) {
            const pathArrayHeader = pathArray[pathArray.length - 1].split('?');
            const fileFullName =
              pathArrayHeader[pathArrayHeader.length - 2].split('.');

            const folder_path_old = selfi_image
              .replace(process.env.AWS_URL, '')
              .split('?');
            const filename = `${Date.now()}_${random}.${fileFullName[1]}`;
            let folder_path = '';
            const fileFolderPath = FilePath.getFolderConfig().selfi_image;
            folder_path = fileFolderPath.file_path.replace(
              fileFolderPath.replace,
              order_id
            );
            folder_path += filename;
            await copyUploedFile(folder_path_old[0].substring(1), folder_path);
            await models.Orders.update(
              { selfi_image: filename },
              {
                where: {
                  order_id,
                },
              }
            );
          }
        }
      }
      if (document_id) {
        if (!validUrl.isWebUri(document_id)) {
          const type = document_id.split(';')[0].split('/')[1];
          const filename = `${Date.now()}_${random}.${type}`;
          let folder_pathself = '';
          const fileFolderPath = FilePath.getFolderConfig().document_id;
          folder_pathself = fileFolderPath.file_path.replace(
            fileFolderPath.replace,
            order_id
          );
          folder_pathself += filename;
          await uploadBase64File(document_id, folder_pathself);
          await models.Orders.update(
            { document_id: filename },
            {
              where: {
                order_id,
              },
            }
          );
        } else {
          const pathArray = document_id.split('/');
          if (pathArray[pathArray.length - 2] !== order_id) {
            const pathArrayHeader = pathArray[pathArray.length - 1].split('?');
            const fileFullName =
              pathArrayHeader[pathArrayHeader.length - 2].split('.');

            const folder_path_old = document_id
              .replace(process.env.AWS_URL, '')
              .split('?');
            const filename = `${Date.now()}_${random}.${fileFullName[1]}`;
            let folder_path = '';
            const fileFolderPath = FilePath.getFolderConfig().document_id;
            folder_path = fileFolderPath.file_path.replace(
              fileFolderPath.replace,
              order_id
            );
            folder_path += filename;
            await copyUploedFile(folder_path_old[0].substring(1), folder_path);
            await models.Orders.update(
              { document_id: filename },
              {
                where: {
                  order_id,
                },
              }
            );
          }
        }
      }
      Object.values(answers).map(async (item) => {
        item.user_id = user_id;
        item.organation_id = getOrganizationData.user_id;
        let filename = '';
        let folder_path_old = [];
        if (
          item.question_type === 6 &&
          item.is_new === 2 &&
          item.user_question_ans_id !== 0 &&
          item.ans_value !== '' &&
          item.type === 1
        ) {
          let folder_path = '';
          const fileFolderPath = FilePath.getFolderConfig().ans_value_image;
          folder_path = fileFolderPath.file_path.replace(
            fileFolderPath.replace,
            item.user_question_ans_id
          );
          const type = item.ans_value.split(';')[0].split('/')[1];
          filename = `${Date.now()}_${random}.${type}`;
          folder_path += filename;
          await uploadBase64File(item.ans_value, folder_path);
          item.ans_value = filename;
        }
        item.user_question_ans_option = item.user_question_ans_option.map(
          (value) => ({
            order_id: value.order_id,
            option_value: value.option_value,
            question_option_id: value.question_option_id,
            is_delete: value.is_delete,
            is_new: value.is_new,
            user_question_ans_option_id: value.user_question_ans_option_id,
            user_id,
            organation_id: getOrganizationData.user_id,
          })
        );

        await models.UserQuestionAns.findOne({
          where: {
            user_question_ans_id: item.user_question_ans_id,
          },
        }).then(async (obj) => {
          // update
          if (
            obj &&
            item.is_delete === 1 &&
            item.is_new === 2 &&
            item.user_question_ans_id !== 0
          ) {
            if (
              item.user_question_ans_option !== null &&
              item.user_question_ans_option.length > 0
            ) {
              Object.keys(item.user_question_ans_option).map(async (key) => {
                const option_values = item.user_question_ans_option[key];
                option_values.user_id = user_id;
                option_values.organation_id = getOrganizationData.user_id;
                await models.UserQuestionAnsOption.findOne({
                  where: {
                    user_question_ans_option_id:
                      option_values.user_question_ans_option_id,
                  },
                }).then(async (objo) => {
                  // update
                  if (objo && option_values.is_delete === 1) {
                    return objo.update({
                      question_option_id: option_values.question_option_id,
                      option_value: option_values.option_value,
                    });
                  }
                  if (
                    objo &&
                    option_values.is_delete === 2 &&
                    option_values.is_new === 1
                  ) {
                    return objo.destroy();
                  }
                  if (
                    (option_values.is_delete === 1 &&
                      option_values.is_new === 2) ||
                    option_values.user_question_ans_option_id === 0
                  ) {
                    // insert
                    return models.UserQuestionAnsOption.create({
                      order_id: option_values.order_id,
                      user_question_ans_id: item.user_question_ans_id,
                      option_value: option_values.option_value,
                      question_id: item.question_id,
                      question_option_id: option_values.question_option_id,
                      user_id,
                      organation_id: getOrganizationData.user_id,
                    });
                  }
                  return null;
                });
              });
            }
            return obj.update(item);
          }

          if (obj && item.is_delete === 2 && item.is_new === 1) {
            await models.UserQuestionAnsOption.destroy({
              where: {
                user_question_ans_id: item.user_question_ans_id,
              },
            });
            return obj.destroy();
          }
          if (
            (item.is_delete === 1 && item.is_new === 2) ||
            (item.user_question_ans_id === 0 && item.ans_value !== '')
          ) {
            item.user_question_ans_option = item.user_question_ans_option.map(
              (value) => ({
                order_id: value.order_id,
                option_value: value.option_value,
                question_option_id: value.question_option_id,
                user_id,
                organation_id: getOrganizationData.user_id,
              })
            );
            // insert
            let fileContent = '';
            if (item.question_type === 6 && item.type === 1) {
              fileContent = item.ans_value;
              item.ans_value = filename;
            }
            const data = await models.UserQuestionAns.create(item, {
              include: [
                {
                  model: models.UserQuestionAnsOption,
                  as: 'user_question_ans_option',
                },
              ],
            });
            if (item.question_type === 6 && item.type === 1) {
              let folder_path = '';
              const fileFolderPath = FilePath.getFolderConfig().ans_value_image;
              folder_path = fileFolderPath.file_path.replace(
                fileFolderPath.replace,
                data.user_question_ans_id
              );
              folder_path += filename;
              await uploadBase64File(fileContent, folder_path);
              item.ans_value = filename;
              data.update(item);
            } else if (item.question_type === 6 && item.type === 2) {
              const pathArray = item.ans_value.split('/');
              const pathArrayHeader =
                pathArray[pathArray.length - 1].split('?');
              const fileFullName =
                pathArrayHeader[pathArrayHeader.length - 2].split('.');

              folder_path_old = item.ans_value
                .replace(process.env.AWS_URL, '')
                .split('?');
              filename = `${Date.now()}_${random}.${fileFullName[1]}`;
              let folder_path = '';
              const fileFolderPath = FilePath.getFolderConfig().ans_value_image;
              folder_path = fileFolderPath.file_path.replace(
                fileFolderPath.replace,
                data.user_question_ans_id
              );
              folder_path += filename;
              await copyUploedFile(
                folder_path_old[0].substring(1),
                folder_path
              );
              item.ans_value = filename;
              data.update(item);
            }
          }

          return null;
        });
      });

      return response.successResponse(
        req,
        res,
        'admin.store_checkout_intake_question_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new QuestionsController();
