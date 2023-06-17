const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');
const PaginationLength = require('../../../config/pagination.config');
const emailHelper = require('../../../helpers/email.helper');
const FilePath = require('../../../config/upload.config');
const { getFileUrl } = require('../../../helpers/s3file.helper');
const { PatientDataSync } = require('../../../helpers/dosespot.helper');

class PatinetController {
  /**
   * @name listpatient
   * @description Get All Patients Data.
   * @param req,res
   * @returns {Json} success
   */
  async listpatient(req, res) {
    try {
      const {
        page,
        serach_text,
        user_status,
        admin_status,
        profile_status,
        organation_id,
        from_date,
        to_date,
      } = req.query;
      const wherecondition = [];
      wherecondition.push({ user_type: 3 });
      if (serach_text !== '') {
        wherecondition.push({
          [Op.or]: {
            where: Sequelize.where(
              Sequelize.fn(
                'concat',
                Sequelize.col('first_name'),
                ' ',
                Sequelize.col('last_name')
              ),
              {
                [Op.like]: `%${decodeURIComponent(serach_text)}%`,
              }
            ),
            email: {
              [Op.like]: `%${decodeURIComponent(serach_text)}%`,
            },
            organation_id: {
              [Op.in]: Sequelize.literal(
                `(SELECT OrgInfo.user_id FROM organization_info as OrgInfo WHERE OrgInfo.company_name LIKE '%${decodeURIComponent(
                  serach_text
                )}%')`
              ),
            },
          },
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
      const condition = {
        attributes: [
          'user_id',
          'first_name',
          'last_name',
          'email',
          'country_id',
          'phone',
          'profile_image',
          'user_type',
          'admin_status',
          'organation_id',
          'user_status',
          'profile_setup',
          'created_at',
          [
            Sequelize.literal(`(
              SELECT company_name
              FROM organization_info AS organization_info_table
              WHERE ( organization_info_table.user_id = Users.organation_id)
              )`),
            'company_name',
          ],
        ],
        include: [
          {
            model: models.Countries,
            as: 'countries',
            attributes: ['phone_code'],
          },
        ],
      };
      if (organation_id !== '') {
        wherecondition.push({ organation_id });
      }
      if (admin_status !== '') {
        wherecondition.push({ admin_status });
      }
      if (user_status !== '') {
        wherecondition.push({ user_status });
      }
      if (profile_status !== '') {
        wherecondition.push({ profile_setup: profile_status });
      }
      condition.where = wherecondition;
      condition.page = page;
      condition.paginate = PaginationLength.getPatient();
      condition.order = [['user_id', 'DESC']];
      const { docs, pages, total } = await models.Users.paginate(condition);
      return response.successResponse(req, res, 'admin.get_patient_success', {
        pagination: {
          total,
          count: docs.length,
          current_page: page,
          last_page: pages,
          per_page: PaginationLength.getPatient(),
          hasMorePages: pages > parseInt(page, 10),
        },
        patient_list: docs,
      });
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name patientStatusUpdate
   * @description Patient Update User Status And Admin Status
   * @param req,res
   * @return {Json} success
   */
  async patientStatusUpdate(req, res) {
    try {
      const { user_id, type, reason } = req.body;
      let msg = '';
      const getPatientData = await models.Users.findOne({
        where: {
          user_id,
        },
      });
      if (getPatientData) {
        if (type === 'admin') {
          getPatientData.admin_status =
            getPatientData.admin_status === 1 ? 2 : 1;
          msg = 'admin.update_admin_status_patient_success';
        }
        if (type === 'user') {
          getPatientData.user_status = getPatientData.user_status === 1 ? 2 : 1;
          msg = 'admin.update_user_status_patient_success';
        }
      }
      getPatientData.save();
      if (getPatientData.admin_status === 2) {
        getPatientData.reason = reason;
        getPatientData.save();
        const isEmailSent = await emailHelper.sendEmail({
          to: getPatientData.email,
          template: 'telepath-patient-deactivate-account',
          replacements: {
            FIRSTNAME: `${getPatientData.first_name}`,
            REASON: reason,
          },
        });
        if (!isEmailSent) {
          throw new Error('admin.patient_deactivate_mail_not_sent');
        }
      }
      if (getPatientData.admin_status === 1) {
        getPatientData.reason = null;
        getPatientData.save();
        const isEmailSent = await emailHelper.sendEmail({
          to: getPatientData.email,
          template: 'telepath-patient-activate-account',
          replacements: {
            FIRSTNAME: `${getPatientData.first_name}`,
          },
        });
        if (!isEmailSent) {
          throw new Error('admin.patient_activate_mail_not_sent');
        }
      }
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: getPatientData.organation_id,
        },
      });
      if (organizationData) {
        await PatientDataSync(user_id, organizationData.dosespot_org_id);
      } else {
        await PatientDataSync(user_id);
      }
      return response.successResponse(req, res, msg);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
  /**
   * @name getAllOrganizations
   * @description Get All Organisations.
   * @param req,res
   * @returns {Json} success
   */

  async getAllOrganizations(req, res) {
    try {
      const getOrganizationData = await models.Users.findAll({
        attributes: ['user_id', 'organation_id'],
        group: ['organation_id'],
        include: [
          {
            model: models.OrganizationInfo,
            as: 'organization_info',
            attributes: [
              [
                Sequelize.literal(`(
                    SELECT organization_info_id
                    FROM organization_info AS organization_info_table
                    WHERE ( organization_info_table.user_id = Users.organation_id)
                )`),
                'organization_info_id',
              ],
              [
                Sequelize.literal(`(
                    SELECT company_name
                    FROM organization_info AS organization_info_table
                    WHERE ( organization_info_table.user_id = Users.organation_id)
                )`),
                'company_name',
              ],
            ],
          },
        ],
      });
      return response.successResponse(
        req,
        res,
        'admin.get_organizations_success',
        getOrganizationData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientOrganisationGeneralDetails
   * @description Get Patient & Organization General Details.
   * @param req,res
   * @returns {Json} success
   */

  async getPatientOrganisationGeneralDetails(req, res) {
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
      let orgCountryId = '';
      let patientData = {};
      let oraganizationData = {};
      if (
        getPatientData &&
        typeof getPatientData === 'object' &&
        getPatientData &&
        getPatientData.users !== ''
      ) {
        const getOraganizationData = await models.Users.findOne({
          attributes: [
            ...fields,
            [
              Sequelize.literal(`(
            SELECT company_name
            FROM organization_info AS organization_info_table
            WHERE ( organization_info_table.user_id = Users.organation_id)
            )`),
              'company_name',
            ],
          ],
          where: { user_id: getPatientData.organation_id },
        });
        orgCountryId = getOraganizationData
          ? getOraganizationData.country_id
          : '';
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
          company_name: getOraganizationData.company_name,
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
        oraganizationData = {
          first_name: getOraganizationData && getOraganizationData.first_name,
          last_name: getOraganizationData && getOraganizationData.last_name,
          email: getOraganizationData && getOraganizationData.email,
          country_id: getOraganizationData && getOraganizationData.country_id,
          phone: getOraganizationData && getOraganizationData.phone,
          user_id: getOraganizationData && getOraganizationData.user_id,
          admin_status:
            getOraganizationData && getOraganizationData.admin_status,
          dob: getOraganizationData && getOraganizationData.dob,
          user_status: getOraganizationData && getOraganizationData.user_status,
          reason: getOraganizationData && getOraganizationData.reason,
          organation_id:
            getOraganizationData && getOraganizationData.organation_id,
          company_name:
            getOraganizationData &&
            getOraganizationData.dataValues.company_name,
          profile_image:
            getOraganizationData &&
            (await getOraganizationData.profile_image.then(
              (dataUrl) => dataUrl
            )),
        };
      }
      let orgPhoneCode;
      if (orgCountryId !== '') {
        orgPhoneCode = await models.Countries.findOne({
          where: {
            country_id: orgCountryId,
          },
          attributes: ['phone_code'],
        });
      }
      if (orgPhoneCode !== '' && orgPhoneCode !== null) {
        oraganizationData.phone_code = orgPhoneCode.phone_code;
      }
      return response.successResponse(
        req,
        res,
        'admin.get_patient_organization_success',
        { patientData, oraganizationData }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
  /**
   * @name EditPatientGeneralDetails
   * @description Edit Patient General Details.
   * @param req,res
   * @returns {Json} success
   */

  async editPatientProfile(req, res) {
    try {
      const {
        user_id,
        organation_id,
        first_name,
        last_name,
        email,
        phone,
        country_id,
        admin_status,
        user_status,
        reason,
      } = req.body;
      const isEmailExists = await models.Users.findOne({
        where: {
          email,
          user_id: {
            [Op.not]: user_id,
          },
          organation_id,
        },
      });
      if (isEmailExists) {
        throw new Error(
          'admin.edit_patient_email_already_register_with_account'
        );
      }
      const patientData = await models.Users.findOne({
        where: {
          user_id,
        },
      });
      if (admin_status === 2 && patientData.admin_status !== admin_status) {
        const isEmailSent = await emailHelper.sendEmail({
          to: patientData.email,
          template: 'telepath-patient-deactivate-account',
          replacements: {
            FIRSTNAME: `${patientData.first_name}`,
            REASON: reason,
          },
        });
        if (!isEmailSent) {
          throw new Error('admin.patient_deactivate_mail_not_sent');
        }
      }
      if (admin_status === 1 && patientData.admin_status !== admin_status) {
        const isEmailSent = await emailHelper.sendEmail({
          to: patientData.email,
          template: 'telepath-patient-activate-account',
          replacements: {
            FIRSTNAME: `${patientData.first_name}`,
          },
        });
        if (!isEmailSent) {
          throw new Error('admin.patient_activate_mail_not_sent');
        }
      }
      const updatePatientData = await models.Users.update(
        {
          first_name,
          last_name,
          email,
          phone,
          country_id,
          admin_status,
          user_status,
          reason,
        },
        {
          where: {
            user_id,
          },
        }
      );
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: patientData.organation_id,
        },
      });
      if (organizationData) {
        await PatientDataSync(user_id, organizationData.dosespot_org_id);
      } else {
        await PatientDataSync(user_id);
      }
      return response.successResponse(
        req,
        res,
        'admin.patient_edit_patient_profile_success',
        {
          user_id: updatePatientData.user_id,
        }
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
   * @name getPatientOrderDetails
   * @description Get Order Details Data.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getPatientOrderDetails(req, res) {
    try {
      const { order_id, user_id } = req.query;
      const organizationData = await models.Users.findOne({
        where: {
          user_id,
        },
        attributes: ['organation_id'],
      });
      const getOrderData = await models.Orders.findOne({
        where: {
          user_id,
          order_id,
          order_status: {
            [Op.ne]: 1,
          },
        },
        attributes: [
          'order_id',
          'user_id',
          'total_amount',
          'selfi_image',
          'created_at',
          'order_note',
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
            attributes: ['formulary_id', 'qty', 'sub_total', 'order_item_id'],
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
            user_id: organizationData.organation_id,
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
        data.user_cards = getOrderData.user_cards;
        data.selfi_image = await getOrderData.selfi_image.then(
          (dataUrl) => dataUrl
        );
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
              order_id,
              question_id: {
                [Op.in]: countQuestionData.map((val) => val.question_id),
              },
            },
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
          return returnData;
        });
        data.is_intake_question_fill =
          countUserQuestionIntakeData <= countIntakeQuestionData.length &&
          countUserQuestionIntakeData !== 0
            ? 1
            : 2;
        data.intake_question_count = countIntakeQuestionData.length;
        data.user_intake_question_count = countUserQuestionIntakeData;
      }
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.get_patient_order_details_success',
          data
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientMedicalIntake
   * @description Get patient Formulary Intake.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getPatientMedicalIntake(req, res) {
    try {
      const { formulary_id, order_id, user_id } = req.query;
      const organizationData = await models.Users.findOne({
        where: {
          user_id,
        },
        attributes: ['organation_id'],
      });
      const questionData = await models.Questions.scope(
        'defaultScope',
        'patientformulryUserQuestionColumns'
      ).findAll({
        where: {
          formulary_id,
          user_id: organizationData.organation_id,
        },
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
          'admin.get_patient_medical_intake_success',
          geFormulartQuestionsData
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientGeneralIntake
   * @description Get patient Checkout General Intake .
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getPatientGeneralIntake(req, res) {
    try {
      const { order_id, user_id } = req.query;
      const organizationData = await models.Users.findOne({
        where: {
          user_id,
        },
        attributes: ['organation_id'],
      });
      const questionData = await models.Questions.scope(
        'defaultScope',
        'intakeUserQuestionColumns'
      ).findAll({
        order: [['question_id', 'ASC']],
        where: {
          user_id: organizationData.organation_id,
        },
        include: [
          {
            model: models.QuestionOptions,
            as: 'question_options',
            include: [
              {
                model: models.UserQuestionAnsOption,
                as: 'user_question_ans_option',
                where: {
                  order_id,
                  user_id,
                },
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
          'admin.get_patient_general_intake_success',
          getGeneralIntakeQuestionsData
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientOrderTransactions
   * @description Get Patient Order Transactions.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getPatientOrderTransactions(req, res) {
    try {
      const { order_id, user_id } = req.query;
      const organizationData = await models.Users.findOne({
        where: {
          user_id,
        },
        attributes: ['organation_id'],
      });
      const transactionData = await models.UserTransactions.findAll({
        where: {
          user_id,
          order_id,
          organization_id: organizationData.organation_id,
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
              organization_id: organizationData.organation_id,
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
        'admin.patient_order_transaction_get_success',
        transactionData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getorderNotes
   * @description Ge Order Note Details added by organization.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getorderNotes(req, res) {
    try {
      const { user_id, order_id } = req.query;
      const orderNoteDetails = await models.OrderNotes.findAll({
        where: {
          user_id,
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
   * @name patientBookingList
   * @description Get All Patient Booking Data.
   *  @param {Request} req
   *  @param {Response} res
   * @returns {Json} success
   */
  async patientBookingList(req, res) {
    try {
      const {
        page,
        start_date,
        end_date,
        booking_status,
        serach_text,
        user_id,
        timezone_id,
        timezone,
      } = req.query;
      let orgTimezone = '';
      let default_timezone = '';
      let default_timezone_id = '';
      const paginate = 10;
      const condition = [];
      if (start_date) {
        condition.push({
          book_date: {
            [Op.gte]: start_date,
          },
        });
      }
      if (end_date) {
        condition.push({
          book_date: {
            [Op.lte]: end_date,
          },
        });
      }
      if (booking_status) {
        condition.push({
          booking_status: {
            [Op.in]: booking_status.split(','),
          },
        });
      }
      if (serach_text) {
        condition.push({
          [Op.or]: {
            user_id: {
              [Op.in]: [
                Sequelize.literal(`(
             SELECT Users.user_id FROM users AS Users WHERE (concat(first_name, ' ', last_name)) LIKE "%${serach_text}%"
            )`),
              ],
            },
            bookings_id: {
              [Op.like]: `%${serach_text}%`,
            },
          },
        });
      }
      condition.push({ user_id });
      const getOrgId = await models.Users.findOne({
        where: {
          user_id,
        },
        attributes: ['organation_id'],
      });
      const getTimezoneId = await models.Users.findOne({
        where: {
          user_id: getOrgId.organation_id,
        },
        attributes: ['timezone_id'],
      });
      const getTimezone = await models.Timezones.findOne({
        where: {
          timezone_id: getTimezoneId.timezone_id,
        },
        attributes: ['utc'],
      });
      orgTimezone = getTimezone.utc;
      let timezone_data = '';
      if (timezone_id) {
        timezone_data = await models.Timezones.findOne({
          where: {
            timezone_id,
          },
        });
      } else {
        timezone_data = await models.Timezones.findOne({
          where: {
            utc: {
              [Op.like]: `%${timezone}%`,
            },
          },
        });
      }
      if (timezone_data) {
        timezone_data = await models.Timezones.findOne({
          where: {
            title: {
              [Op.like]: `%${timezone_data.title}%`,
            },
          },
          group: [['title']],
        });
      }
      default_timezone = timezone_data.utc;
      default_timezone_id = timezone_data.timezone_id;
      const { docs, pages, total } = await models.Bookings.paginate({
        where: condition,
        attributes: [
          'bookings_id',
          'organation_id',
          'user_id',
          'book_date',
          'start_time',
          'end_time',
          'booking_status',
          'cancellation_by',
          'booking_notes',
          'reason',
          'cancellation_by',
          'cancellation_timestamp',
          'created_at',
        ],
        order: [
          ['booking_status', 'asc'],
          [
            Sequelize.fn(
              'concat',
              Sequelize.col('book_date'),
              ' ',
              Sequelize.col('start_time')
            ),
            'asc',
          ],
        ],
        page,
        paginate,
      });
      return response.successResponse(
        req,
        res,
        'admin.get_patient_booking_list_success',
        {
          pagination: {
            total,
            count: docs.length,
            current_page: page,
            last_page: pages,
            per_page: paginate,
            hasMorePages: pages > parseInt(page, 10),
          },
          data_list: docs,
          orgTimezone,
          default_timezone,
          default_timezone_id,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}

module.exports = new PatinetController();
