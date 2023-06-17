const { Op } = require('sequelize');
const moment = require('moment');
const Sequelize = require('sequelize');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');
const { sendEmail } = require('../../../helpers/email.helper');
const PaginationLength = require('../../../config/pagination.config');
const emailHelper = require('../../../helpers/email.helper');
const { encryptValues } = require('../../../helpers/common.helper');
const {
  createSubscriptionPayment,
  cancelSubscription,
} = require('../../../helpers/payment.helper');
const { organizationDataSync } = require('../../../helpers/dosespot.helper');
const { setFormatDate } = require('../../../helpers/common.helper');

class OrganizationController {
  /**
   * @name organizationAdd
   * @description Add Organization.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */

  async organizationAdd(req, res) {
    try {
      const {
        first_name,
        last_name,
        email,
        admin_status,
        user_status,
        phone,
        country_id,
      } = req.body;
      const organizationData = {
        first_name,
        last_name,
        email,
        account_type: 1,
        user_type: 2,
        admin_status,
        user_status,
        profile_setup: 2,
        phone,
        country_id,
      };

      /** ***Check Email Already Exists******* */
      const isEmailExists = await models.Users.findOne({
        where: { email },
      });
      if (isEmailExists) {
        throw new Error(
          'admin.organization_email_already_register_with_account'
        );
      }

      const organization = await models.Users.create(organizationData);

      const encodedToken = Buffer.from(
        organization.user_id.toString()
      ).toString('base64');
      const org_user_id = encryptValues(organization.user_id);
      const { FRONT_URL } = process.env;
      const template = 'telepath-register-set-password';
      const link = `${FRONT_URL}/set-password/${org_user_id}`;
      const isEmailSent = await sendEmail({
        to: organization.email,
        template,
        replacements: {
          FIRSTNAME: `${organization.first_name}`,
          PASSWORDLINK: link,
        },
      });

      if (!isEmailSent) {
        throw new Error('admin.organization_add_fail_send_mail');
      }
      return response.successResponse(
        req,
        res,
        'admin.organization_add_success',
        {
          encodedToken,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name getOrganization
   * @description Get Organization Data For Edit.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */

  async getOrganization(req, res) {
    try {
      const { user_id } = req.params;
      const organizationData = await models.Users.findOne({
        attributes: [
          'first_name',
          'last_name',
          'email',
          'admin_status',
          'user_status',
          'profile_image',
          'reason',
          'user_reason',
          'dob',
          'phone',
          'country_id',
          'timezone_id',
        ],
        include: [
          {
            model: models.OrganizationInfo,
            as: 'organization_info',
            required: false,
          },
        ],
        where: {
          user_id,
        },
      });
      const getOraganizationData = {
        first_name: organizationData.first_name,
        last_name: organizationData.last_name,
        email: organizationData.email,
        admin_status: organizationData.admin_status,
        user_status: organizationData.user_status,
        reason: organizationData.reason,
        user_reason: organizationData.user_reason,
        dob: organizationData.dob,
        phone: organizationData.phone,
        country_id: organizationData.country_id,
        timezone_id: organizationData.timezone_id,
        npi_number: organizationData.organization_info?.npi_number || '',
        address: organizationData.organization_info?.address || '',
        city: organizationData.organization_info?.city || '',
        state: organizationData.organization_info?.state || '',
        postcode: organizationData.organization_info?.postcode || '',
        country: organizationData.organization_info?.country || '',
        is_insurance_required:
          organizationData.organization_info?.is_insurance_required || '',
        doctor_visit_fee:
          organizationData.organization_info?.doctor_visit_fee || '',
        telemedicine_platform_fee:
          organizationData.organization_info?.telemedicine_platform_fee || '',
        profile_image: await organizationData.profile_image.then(
          (dataUrl) => dataUrl
        ),
      };
      if (organizationData.timezone_id !== null) {
        const timezoneData = await models.Timezones.findOne({
          where: {
            timezone_id: organizationData.timezone_id,
          },
          attributes: ['text'],
        });
        getOraganizationData.text = timezoneData.text;
      } else {
        getOraganizationData.text = '';
      }
      return response.successResponse(
        req,
        res,
        'admin.get_organization_success',
        getOraganizationData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name editOrganization
   * @description Update Organization Data.
   * @param req,res
   * @returns {Json} success
   */
  async editOrganization(req, res) {
    try {
      const {
        user_id,
        first_name,
        last_name,
        email,
        phone,
        country_id,
        admin_status,
        user_status,
        timezone_id,
        is_insurance_required,
      } = req.body;
      let { reason, doctor_visit_fee, telemedicine_platform_fee } = req.body;
      if (doctor_visit_fee === '') {
        doctor_visit_fee = null;
      }
      if (telemedicine_platform_fee === '') {
        telemedicine_platform_fee = null;
      }
      const isEmailExists = await models.Users.findOne({
        where: {
          email,
          user_id: {
            [Op.not]: user_id,
          },
        },
      });
      if (isEmailExists) {
        throw new Error(
          'admin.organization_email_already_register_with_account'
        );
      }
      const getorganizationData = await models.Users.findOne({
        where: {
          user_id,
        },
      });
      if (
        getorganizationData.admin_status === 1 &&
        admin_status !== getorganizationData.admin_status
      ) {
        const isEmailSent = await emailHelper.sendEmail({
          to: getorganizationData.email,
          template: 'telepath-deactivate-account',
          replacements: {
            FIRSTNAME: `${getorganizationData.first_name}`,
            REASON: reason,
          },
        });
        if (!isEmailSent) {
          throw new Error('admin.organization_deactivate_mail_not_sent');
        }
      }
      if (
        getorganizationData.admin_status === 2 &&
        admin_status !== getorganizationData.admin_status
      ) {
        reason = null;
        const isEmailSent = await emailHelper.sendEmail({
          to: getorganizationData.email,
          template: 'telepath-activate-account',
          replacements: {
            FIRSTNAME: `${getorganizationData.first_name}`,
          },
        });
        if (!isEmailSent) {
          throw new Error('admin.organization_activate_mail_not_sent');
        }
      }

      const updateOrganigationData = await models.Users.update(
        {
          first_name,
          last_name,
          email,
          phone,
          country_id,
          admin_status,
          user_status,
          reason,
          timezone_id,
        },
        {
          where: {
            user_id,
          },
        }
      );
      await organizationDataSync(user_id);
      await models.OrganizationInfo.update(
        {
          is_insurance_required,
          doctor_visit_fee,
          telemedicine_platform_fee,
        },
        {
          where: {
            user_id,
          },
        }
      );
      return response.successResponse(
        req,
        res,
        'admin.update_organization_success',
        {
          user_id: updateOrganigationData.user_id,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name list
   * @description Get All Organization Data.
   * @param req,res
   * @returns {Json} success
   */
  async listOrganization(req, res) {
    try {
      const {
        page,
        serach_text,
        user_status,
        admin_status,
        profile_status,
        from_date,
        to_date,
      } = req.query;
      const wherecondition = [];
      wherecondition.push({ user_type: 2 });
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
            user_id: {
              [Op.in]: Sequelize.literal(
                `(SELECT OrgInfo.user_id FROM organization_info as OrgInfo WHERE OrgInfo.company_name LIKE '%${decodeURIComponent(
                  serach_text
                )}%' OR OrgInfo.subdomain_name LIKE '%${decodeURIComponent(
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
          'profile_image',
          'user_type',
          'admin_status',
          'user_status',
          'profile_setup',
          'created_at',
        ],
      };
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
      condition.include = [
        {
          model: models.OrganizationInfo,
          as: 'organization_info',
          require: false,
          attributes: [
            'organization_info_id',
            'company_name',
            'subdomain_name',
          ],
        },
      ];
      condition.page = page;
      condition.paginate = PaginationLength.getOrganization();
      condition.order = [['user_id', 'DESC']];
      const { docs, pages, total } = await models.Users.paginate(condition);
      return response.successResponse(
        req,
        res,
        'admin.get_organization_success',
        {
          pagination: {
            total,
            count: docs.length,
            current_page: page,
            last_page: pages,
            per_page: PaginationLength.getOrganization(),
            hasMorePages: pages > parseInt(page, 10),
          },
          organization_list: docs,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name organizationAdminUserStatusUpdate
   * @description Update User Status And Admin Status
   * @param req,res
   * @return {Json} success
   */
  async organizationAdminUserStatusUpdate(req, res) {
    try {
      const { user_id, type, reason } = req.body;
      let msg = '';
      const getOraganizationData = await models.Users.findOne({
        where: {
          user_id,
        },
      });
      if (getOraganizationData) {
        if (type === 'admin') {
          getOraganizationData.admin_status =
            getOraganizationData.admin_status === 1 ? 2 : 1;
          msg = 'admin.update_admin_status_organization_success';
        }
        if (type === 'user') {
          getOraganizationData.user_status =
            getOraganizationData.user_status === 1 ? 2 : 1;
          msg = 'admin.update_user_status_organization_success';
        }
      }
      getOraganizationData.save();
      if (getOraganizationData.admin_status === 2) {
        getOraganizationData.reason = reason;
        getOraganizationData.save();
        const isEmailSent = await emailHelper.sendEmail({
          to: getOraganizationData.email,
          template: 'telepath-deactivate-account',
          replacements: {
            FIRSTNAME: `${getOraganizationData.first_name}`,
            REASON: reason,
          },
        });
        if (!isEmailSent) {
          throw new Error('admin.organization_deactivate_mail_not_sent');
        }
      }
      if (getOraganizationData.admin_status === 1) {
        getOraganizationData.reason = null;
        getOraganizationData.save();
        const isEmailSent = await emailHelper.sendEmail({
          to: getOraganizationData.email,
          template: 'telepath-activate-account',
          replacements: {
            FIRSTNAME: `${getOraganizationData.first_name}`,
          },
        });
        if (!isEmailSent) {
          throw new Error('admin.organization_activate_mail_not_sent');
        }
      }
      await organizationDataSync(user_id);
      return response.successResponse(req, res, msg);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationPracticeData
   * @description Get Organization Practice Data.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async getOrganizationPracticeData(req, res) {
    try {
      const { user_id } = req.query;
      const getOrganizationPracticeData = await models.OrganizationInfo.scope([
        'defaultScope',
        'getOrganizationPracticeData',
      ]).findOne({
        where: {
          user_id,
        },

        include: [
          {
            model: models.Users,
            as: 'users',
            required: false,
          },
          {
            model: models.OrganizationSpecialities,
            as: 'organization_specialities',
            required: false,
            include: [
              {
                model: models.Specialities,
                as: 'specialities',
                required: false,
              },
            ],
          },
        ],
      });
      if (
        getOrganizationPracticeData &&
        getOrganizationPracticeData.state_ids
      ) {
        getOrganizationPracticeData.organization_specialities =
          getOrganizationPracticeData.organization_specialities.map(
            (value) => ({
              name: value.specialities ? value.specialities.name : '',
              specialities_type: value.specialities_type,
              typespecialities_other_text: value.typespecialities_other_text,
            })
          );
        const ids = getOrganizationPracticeData.state_ids.split(',');
        const stateData = await models.States.findAll({
          attributes: ['name'],
          where: {
            state_id: {
              [Op.in]: ids,
            },
          },
        });
        if (stateData) {
          getOrganizationPracticeData.state_names = stateData
            .map((data) => data.name)
            .join(',');
        }
        const getStateData = await models.States.findOne({
          where: {
            state_id: getOrganizationPracticeData.state,
          },
        });
        if (getStateData) {
          getOrganizationPracticeData.state = `${getStateData.name} (${getStateData.short_code})`;
        }
      }
      let getOrganizationPracticeDatas = [];
      if (getOrganizationPracticeData) {
        getOrganizationPracticeDatas = getOrganizationPracticeData.dataValues;
        getOrganizationPracticeDatas.organization_specialities =
          getOrganizationPracticeData.organization_specialities;
        getOrganizationPracticeDatas.state_names =
          getOrganizationPracticeData.state_names;
      }
      return response.successResponse(
        req,
        res,
        'admin.get_organization_practice_data_success',
        getOrganizationPracticeDatas
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationBrandColorDetail
   * @description Get Organization Brand Color Detail.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async getOrganizationBrandColorDetail(req, res) {
    try {
      const { user_id } = req.query;
      const getOrganizationBrandColorData = await models.OrganizationInfo.scope(
        ['defaultScope', 'getOrganizationBrandColorData']
      ).findOne({
        where: {
          user_id,
        },
      });
      let OrganizationBrandColorData = {};
      if (getOrganizationBrandColorData) {
        OrganizationBrandColorData = getOrganizationBrandColorData.dataValues;
        OrganizationBrandColorData.header_logo =
          await getOrganizationBrandColorData.header_logo.then(
            (dataUrl) => dataUrl
          );
        OrganizationBrandColorData.footer_logo =
          await getOrganizationBrandColorData.footer_logo.then(
            (dataUrl) => dataUrl
          );
      }
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.get_organization_brand_color_detail_success',
          OrganizationBrandColorData
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOraganizationSubscriptionData
   * @description Get Organization Subscription Detail.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async getOraganizationSubscriptionData(req, res) {
    try {
      const { user_id } = req.query;
      const getCardData = await models.UserCards.findOne({
        where: { user_id, is_default: 1 },
        order: [['user_card_id', 'DESC']],
      });
      const getSubscriptionData = await models.SubscriptionHistory.findOne({
        where: {
          user_id,
          payment_status: 1,
          subscription_status: { [Op.or]: [2, 4] },
        },
      });
      const getCancelSubscriptionData =
        await models.SubscriptionHistory.findOne({
          where: {
            user_id,
            payment_status: 1,
            subscription_status: 3,
          },
        });
      return response.successResponse(
        req,
        res,
        'admin.get_organization_subscription_data_success',
        {
          card_data: getCardData,
          current_subscription: getSubscriptionData,
          cancel_subscription: getCancelSubscriptionData,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name organizationSubscriptionDetailsStore
   * @description store Organization Subscription Data.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async organizationSubscriptionDetailsStore(req, res) {
    try {
      const { user_id, amount } = req.body;
      const getUserData = await models.Users.findOne({ where: { user_id } });
      const getCardData = await models.UserCards.findOne({
        where: { user_id, is_default: 1 },
        order: [['user_card_id', 'DESC']],
      });
      const getSubscriptionData = await models.SubscriptionHistory.findOne({
        where: {
          user_id,
          payment_status: 1,
          subscription_status: { [Op.or]: [2, 4] },
        },
      });
      if (
        getCardData &&
        (!getSubscriptionData ||
          (getSubscriptionData &&
            moment(getSubscriptionData.renewed_date).format('YYYY-MM-DD') <=
              moment().format('YYYY-MM-DD')))
      ) {
        const getCancelSubscriptionData =
          await models.SubscriptionHistory.findOne({
            where: {
              user_id,
              payment_status: 1,
              subscription_status: 3,
            },
          });
        console.log(getCancelSubscriptionData);
        await createSubscriptionPayment(
          amount,
          getCardData.card_id,
          getCardData.pay_id,
          `${getUserData.first_name} ${getUserData.last_name}`,
          user_id,
          getCancelSubscriptionData
            ? moment(getCancelSubscriptionData.renewed_date).format(
                'YYYY-MM-DD'
              )
            : moment().tz('Europe/London').format('YYYY-MM-DD')
        )
          .then(async (getSubscription) => {
            const transactionData =
              getSubscription?.data?.data?.createRecurringPayment;
            if (transactionData) {
              if (['SUCCESS'].includes(transactionData.status)) {
                await models.SubscriptionHistory.update(
                  {
                    subscription_status: 1,
                  },
                  {
                    where: {
                      user_id,
                      payment_status: 1,
                      subscription_status: { [Op.or]: [2, 4] },
                    },
                  }
                );
                await models.SubscriptionHistory.create({
                  user_id,
                  card_no: getCardData.card_last_digit,
                  card_id: getCardData.card_id,
                  payment_status: 1,
                  subscription_status: 2,
                  transaction_id: transactionData.recurring_id,
                  plan_amount: parseFloat(
                    transactionData.total_amount_per_payment / 100
                  ),
                  plan_id: transactionData.payment_interval,
                  start_date: `${
                    getCancelSubscriptionData &&
                    moment(getCancelSubscriptionData.renewed_date).format(
                      'YYYY-MM-DD'
                    ) <= moment().tz('Europe/London').format('YYYY-MM-DD')
                      ? moment(getCancelSubscriptionData.renewed_date).format(
                          'YYYY-MM-DD'
                        )
                      : transactionData.prev_payment_date
                  }T00:00:00`,
                  renewed_date: `${
                    getCancelSubscriptionData &&
                    moment(getCancelSubscriptionData.renewed_date).format(
                      'YYYY-MM-DD'
                    ) <= moment().tz('Europe/London').format('YYYY-MM-DD')
                      ? moment(getCancelSubscriptionData.renewed_date)
                          .add(1, 'months')
                          .format('YYYY-MM-DD')
                      : transactionData.next_payment_date
                  }T00:00:00`,
                }).then(async (obj_res) => {
                  const startDate = setFormatDate(obj_res.start_date);
                  const endDate = setFormatDate(obj_res.renewed_date);
                  await sendEmail({
                    to: getUserData.email,
                    template: 'telepath-organization-subscription-done',
                    replacements: {
                      FIRSTNAME: `${getUserData.first_name} ${getUserData.last_name}`,
                      AMOUNT: parseFloat(obj_res.plan_amount).toFixed(2),
                      STARTDATE: startDate,
                      ENDDATE: endDate,
                    },
                  });
                });
              } else {
                throw new Error('admin.subscripon_not_success');
              }
            } else if (getSubscription.data.errors) {
              throw new Error(getSubscription?.data?.errors[0]?.message);
            }
          })
          .catch((error) => {
            throw new Error('admin.subscripon_not_success');
          });
      }
      return response.successResponse(
        req,
        res,
        'admin.organization_subscription_info_save_success'
      );
    } catch (error) {
      console.log(error);
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name organizationSubscriptionDetailsCancel
   * @description cancel Organization Subscription Data.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async organizationSubscriptionDetailsCancel(req, res) {
    try {
      const { user_id } = req.body;
      const getUserData = await models.Users.findOne({
        where: { user_id },
      });
      await models.SubscriptionHistory.findOne({
        where: {
          user_id,
          payment_status: 1,
          subscription_status: { [Op.or]: [2, 4] },
        },
      }).then(async (obj) => {
        if (obj) {
          const startDate = setFormatDate(obj.start_date);
          const endDate = setFormatDate(obj.renewed_date);
          await cancelSubscription(obj.transaction_id).then(
            async (responses) => {
              const transactionData =
                responses.data.data.cancelRecurringPayment;
              if (transactionData === true) {
                obj.update({
                  cancelled_date: new Date(),
                  subscription_status: 3,
                });
                await sendEmail({
                  to: getUserData.email,
                  template: 'telepath-organization-subscription-cancel',
                  replacements: {
                    FIRSTNAME: `${getUserData.first_name} ${getUserData.last_name}`,
                    AMOUNT: parseFloat(obj.plan_amount).toFixed(2),
                    STARTDATE: startDate,
                    ENDDATE: endDate,
                  },
                });
              }
            }
          );
        }
      });
      return response.successResponse(
        req,
        res,
        'admin.organization_subscription_cancel_successfully'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name organizationBookingList
   * @description Get All Organization Booking Data.
   *  @param {Request} req
   *  @param {Response} res
   * @returns {Json} success
   */
  async organizationBookingList(req, res) {
    try {
      const {
        page,
        start_date,
        end_date,
        booking_status,
        patient_id,
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
      const wherecondition = [];
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
      if (patient_id) {
        condition.push({
          user_id: {
            [Op.in]: patient_id.split(','),
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
      condition.push({ organation_id: user_id });
      const getTimezoneId = await models.Users.findOne({
        where: {
          user_id,
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
        include: [
          {
            model: models.Users,
            as: 'users',
            where: wherecondition,
            attributes: ['user_id', 'first_name', 'last_name'],
            require: true,
            paranoid: false,
          },
        ],
        page,
        paginate,
      });
      return response.successResponse(
        req,
        res,
        'admin.get_organization_booking_list_success',
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
module.exports = new OrganizationController();
