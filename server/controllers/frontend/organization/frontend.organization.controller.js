const { Op, Sequelize } = require('sequelize');
const moment = require('moment');

const {
  getUserDataById,
  getSettingvalue,
} = require('../../../helpers/common.helper');
const {
  createSubscriptionPayment,
  updateSubscriptionPayment,
  cancelSubscription,
} = require('../../../helpers/payment.helper');
const response = require('../../../helpers/response.helper');
const { deletefile } = require('../../../helpers/s3file.helper');
const models = require('../../../models/index');
const { sendEmail } = require('../../../helpers/email.helper');
const PaginationLength = require('../../../config/pagination.config');
const { organizationDataSync } = require('../../../helpers/dosespot.helper');

class OrganizationController {
  /**
   * @name getSubDomainToOrganization
   * @description get Organization to sub domain Data.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async getSubDomainToOrganization(req, res) {
    try {
      const { subdomain } = req.headers;
      if (subdomain === undefined) {
        return response.successResponse(
          req,
          res,
          'admin.setting_get_home_page_data_success',
          { user: {}, organizationData: {}, subDomain: '' },
          200
        );
      }
      const getOrganizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });

      let organizationData = {};
      let user = {};
      let userSubscription = {};
      let userCancelSubscription = {};
      let timezone_data = {};
      if (getOrganizationData) {
        organizationData = getOrganizationData.dataValues;
        organizationData.header_logo =
          await getOrganizationData.header_logo.then((dataUrl) => dataUrl);
        organizationData.footer_logo =
          await getOrganizationData.footer_logo.then((dataUrl) => dataUrl);
        user = await getUserDataById(getOrganizationData.user_id);
        userSubscription = await models.SubscriptionHistory.findOne({
          where: {
            user_id: getOrganizationData.user_id,
            payment_status: 1,
            subscription_status: { [Op.or]: [2, 4] },
          },
        });

        userCancelSubscription = await models.SubscriptionHistory.findOne({
          where: {
            user_id: getOrganizationData.user_id,
            payment_status: 1,
            subscription_status: 3,
          },
        });
        timezone_data = await models.Timezones.findOne({
          where: { timezone_id: user.timezone_id },
        });
      }
      const homeSeoData = await models.OrganizationSetting.findAll({
        where: {
          text_key: { [Op.like]: `%home_page_organization_seo%` },
          user_id: getOrganizationData.user_id,
        },
      });
      const getHomeSeoData = {};
      homeSeoData.forEach(async (value) => {
        getHomeSeoData[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_get_home_page_data_success',
          {
            seo_data: getHomeSeoData,
            subDomain: subdomain,
            user,
            organizationData,
            userSubscription,
            userCancelSubscription,
            timezone_data,
          },
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name getSubscriptionSetpData
   * @description get Organization Subscription Setp Data.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async getSubscriptionSetpData(req, res) {
    try {
      const { organization_id } = req.payload.user;
      const getSubscriptionplanData = await models.Settings.findAll({
        where: {
          text_key: { [Op.like]: `%home_page_subscription%` },
        },
      });
      const getSubscriptionData = await models.SubscriptionHistory.findOne({
        where: {
          user_id: organization_id,
          payment_status: 1,
          subscription_status: { [Op.or]: [2, 4] },
        },
      });
      const getLastSubscriptionData = await models.SubscriptionHistory.findOne({
        where: {
          user_id: organization_id,
          payment_status: 1,
        },
        order: [['subscription_history_id', 'DESC']],
      });
      const getCardData = await models.UserCards.findOne({
        where: { user_id: organization_id, is_default: 1 },
        order: [['user_card_id', 'DESC']],
      });
      const subscriptionPlanData = {};
      getSubscriptionplanData.forEach(async (value) => {
        subscriptionPlanData[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });
      const getCancelSubscriptionData =
        await models.SubscriptionHistory.findOne({
          where: {
            user_id: organization_id,
            payment_status: 1,
            subscription_status: 3,
          },
        });
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_get_home_page_data_success',
          {
            subscriptionPlanData,
            userSubscription: getSubscriptionData,
            userCancelSubscription: getCancelSubscriptionData,
            userLastSubscription: getLastSubscriptionData,
            userCard: getCardData,
          },
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name organizationHowItsWorkStore
   * @description store Organization How It's Work Data.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async organizationHowItsWorkStore(req, res) {
    try {
      const { fill_step } = req.body;
      const { organization_id } = req.payload.user;
      await models.OrganizationInfo.findOne({
        where: {
          user_id: organization_id,
        },
      }).then(async (obj) => {
        // update
        if (obj) {
          const updateOrganizationInfoData = obj.update({ fill_step });
          return updateOrganizationInfoData;
        }

        // insert
        return models.OrganizationInfo.create({
          fill_step,
          user_id: organization_id,
        });
      });
      // }
      return response.successResponse(
        req,
        res,
        'admin.organization_general_info_save_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }
  /**
   * @name organizationGeneralInfoStore
   * @description Store Organization general Info Data.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */

  async organizationGeneralInfoStore(req, res) {
    try {
      const {
        company_name,
        subdomain_name,
        state_ids,
        organization_specialities,
        dob,
        country_id,
        phone,
        npi_number,
        address,
        city,
        state,
        postcode,
        country,
      } = req.body;
      const organization_specialities_data = organization_specialities
        .filter(
          (value) =>
            value.organization_specialities_id !== 0 || value.is_checked === 1
        )
        .map((value) => ({
          organization_specialities_id: value.organization_specialities_id,
          is_new: value.is_new,
          is_delete: value.is_delete,
          specialities_type: value.specialities_type,
          typespecialities_other_text: value.typespecialities_other_text,
          specialities_id: value.specialities_id,
        }));
      const { organization_id } = req.payload.user;

      const organizationData = {
        user_id: organization_id,
        company_name,
        subdomain_name,
        state_ids,
        organization_specialities: organization_specialities_data,
        fill_step: 3,
        npi_number,
        address,
        city,
        state,
        postcode,
        country,
      };

      await models.OrganizationInfo.findOne({
        where: {
          user_id: organization_id,
        },
      }).then(async (obj) => {
        // update
        if (obj) {
          const updateOrganizationInfoData = await obj.update(organizationData);
          organization_specialities_data.forEach(async (value) => {
            let {
              organization_specialities_id,
              specialities_id,
              typespecialities_other_text,
              specialities_type,
              is_delete,
            } = value;
            organization_specialities_id =
              organization_specialities_id === ''
                ? 0
                : organization_specialities_id;
            is_delete = is_delete === '' ? 1 : is_delete;
            specialities_type =
              specialities_type === '' ? 1 : specialities_type;
            specialities_id = specialities_id === '' ? null : specialities_id;
            typespecialities_other_text =
              typespecialities_other_text === ''
                ? null
                : typespecialities_other_text;
            const { organization_info_id } = updateOrganizationInfoData;
            if (organization_specialities_id) {
              if (is_delete === 1) {
                await models.OrganizationSpecialities.update(
                  {
                    specialities_id: specialities_id || null,
                    typespecialities_other_text,
                    specialities_type,
                  },
                  {
                    where: {
                      organization_specialities_id,
                    },
                  }
                );
              } else {
                await models.OrganizationSpecialities.destroy({
                  where: {
                    organization_specialities_id,
                  },
                });
              }
            } else {
              await models.OrganizationSpecialities.create({
                organization_info_id,
                specialities_id,
                typespecialities_other_text,
                specialities_type,
              });
            }
          });
          return updateOrganizationInfoData;
        }

        // insert
        return models.OrganizationInfo.create(organizationData, {
          include: [
            {
              model: models.OrganizationSpecialities,
              as: 'organization_specialities',
            },
          ],
        });
      });
      await models.Users.update(
        { dob, phone, country_id },
        {
          where: { user_id: organization_id },
        }
      );
      const getUserData = await models.Users.findOne({
        where: { user_id: organization_id },
      });
      if (getUserData.profile_setup === 1)
        await organizationDataSync(organization_id);

      return response.successResponse(
        req,
        res,
        'admin.organization_general_info_save_success'
      );
    } catch (error) {
      if (error.fields && error.fields.subdomain_name !== undefined) {
        return response.errorResponse(
          req,
          res,
          'admin.organization_general_info_subdomain_name_validation_unique',
          {},
          422
        );
      }
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name getStateData
   * @description  get All State Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getStateData(req, res) {
    try {
      const getStateData = await models.States.scope([
        'defaultScope',
        'getStateData',
      ]).findAll({
        order: [
          ['sequence', 'ASC'],
          ['name', 'ASC'],
        ],
      });
      return response.successResponse(
        req,
        res,
        'admin.get_states_success',
        getStateData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getSpecialitiesData
   * @description Get All specialities Data.
   * @param req,res
   * @returns {Json} success
   */
  async getSpecialitiesData(req, res) {
    try {
      const getSpecialitiesData = await models.Specialities.scope([
        'defaultScope',
        'getSpecialitiesData',
      ]).findAll({
        order: [
          ['sequence', 'ASC'],
          ['name', 'ASC'],
        ],
      });
      return response.successResponse(
        req,
        res,
        'admin.get_specialities_success',
        getSpecialitiesData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationInfo
   * @description Get Organization info Data.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async getOrganizationInfo(req, res) {
    try {
      const { organization_id } = req.payload.user;
      const getOrganizationInfoData = await models.OrganizationInfo.findOne({
        where: { user_id: organization_id },
        raw: true,
      });
      const userData = await models.Users.findOne({
        where: { user_id: organization_id },
      });
      getOrganizationInfoData.dob = userData.dob;
      getOrganizationInfoData.phone = userData.phone;
      getOrganizationInfoData.country_id = userData.country_id;
      const getSpecialitiesData = await models.Specialities.scope([
        'defaultScope',
        'getSpecialitiesData',
      ]).findAll({
        order: [
          ['sequence', 'ASC'],
          ['name', 'ASC'],
        ],
        include: [
          {
            model: models.OrganizationSpecialities,
            as: 'organization_specialities',
          },
        ],
      });
      const getSpecialitiesDataOther =
        await models.OrganizationSpecialities.findOne({
          where: {
            specialities_type: 2,
            organization_info_id: getOrganizationInfoData.organization_info_id,
          },
        });
      if (getSpecialitiesData.length > 0) {
        getOrganizationInfoData.organization_specialities =
          getSpecialitiesData.map((value) => {
            const findData = value.organization_specialities.filter(
              (item) =>
                item.organization_info_id ===
                getOrganizationInfoData.organization_info_id
            );
            return {
              name: value.name,
              typespecialities_other_text: null,
              specialities_type: 1,
              organization_specialities_id:
                findData.length > 0
                  ? findData[0].organization_specialities_id
                  : 0,
              specialities_id: value.specialities_id,
              is_new: 1,
              is_delete: 1,
              is_checked: findData.length > 0 ? 1 : 2,
            };
          });
      }
      getOrganizationInfoData.organization_specialities.push({
        name: 'Other',
        specialities_type: 2,
        specialities_id: null,
        is_new: 1,
        typespecialities_other_text: getSpecialitiesDataOther
          ? getSpecialitiesDataOther.typespecialities_other_text
          : null,
        organization_specialities_id: getSpecialitiesDataOther
          ? getSpecialitiesDataOther.organization_specialities_id
          : 0,
        is_delete: 1,
        is_checked: getSpecialitiesDataOther ? 1 : 2,
      });
      return response.successResponse(
        req,
        res,
        'admin.get_organization_info_success',
        getOrganizationInfoData
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
      const { organization_id } = req.payload.user;
      const getOrganizationBrandColorData = await models.OrganizationInfo.scope(
        ['defaultScope', 'getOrganizationBrandColorData']
      ).findOne({
        where: {
          user_id: organization_id,
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
   * @name organizationBrandInfoStore
   * @description Store Organization Brand Info Data.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */

  async organizationBrandInfoStore(req, res) {
    try {
      const {
        menu_text_color,
        button_icon_color,
        heading_color,
        text_color,
        primary_color,
        banner_text_color,
        background_color,
      } = req.body;
      const { organization_id } = req.payload.user;
      const pathArray = req.body.header_logo.split('/');
      const pathArrayHeader = pathArray[pathArray.length - 1].split('?');
      const header_logo = pathArrayHeader[pathArrayHeader.length - 2];
      const pathArray1 = req.body.footer_logo.split('/');
      const pathArrayFooter = pathArray1[pathArray1.length - 1].split('?');
      const footer_logo = pathArrayFooter[pathArrayFooter.length - 2];

      const organizationData = {
        user_id: organization_id,
        header_logo,
        footer_logo,
        menu_text_color,
        button_icon_color,
        heading_color,
        text_color,
        background_color,
        primary_color,
        banner_text_color,
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
        'admin.organization_general_info_save_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name organizationDeleteHeaderFooter
   * @description Organization Delete header and footer file.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async organizationDeleteHeaderFooter(req, res) {
    try {
      const { url, type } = req.query;
      const { organization_id } = req.payload.user;
      let updateData = {};
      if (type === 'header') {
        updateData = { header_logo: null };
      } else {
        updateData = { footer_logo: null };
      }
      await models.OrganizationInfo.findOne({
        where: {
          user_id: organization_id,
        },
      }).then(async (obj) => {
        // update
        if (obj) {
          const updateOrganizationInfoData = obj.update(updateData);
          return updateOrganizationInfoData;
        }

        // insert
        return models.OrganizationInfo.create(updateData);
      });
      deletefile(url.replace(`${process.env.AWS_URL}/`, ''));

      return response.successResponse(
        req,
        res,
        type === 'header'
          ? 'admin.organization_header_image_remove_save_success'
          : 'admin.organization_footer_image_remove_save_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name organizationStepCompletion
   * @description Organization step Complition.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async organizationStepCompletion(req, res) {
    try {
      const { organization_id, fullname } = req.payload.user;
      const getSettingData = await getSettingvalue(
        'home_page_general_email_address'
      );
      const isEmailSent = await sendEmail({
        to: getSettingData || 'admin.telepath@yopmail.com',
        template: 'telepath-organization-step-done',
        replacements: {
          FIRSTNAME: 'Admin',
          ORGNAME: fullname,
          PROFILEURL: `${process.env.ADMIN_URL}/organisation/subscription-details/${organization_id}`,
        },
      });
      if (!isEmailSent)
        throw new Error('admin.organization_step_completion_not_success');
      else {
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
        organizationData.profile_setup = 1;
        organizationData.save();
        if (organizationData.organization_info) {
          const organizationInfoData = await models.OrganizationInfo.findOne({
            where: {
              user_id: organization_id,
            },
          });
          organizationInfoData.fill_step = 7;
          organizationInfoData.save();
        }
      }
      return response.successResponse(
        req,
        res,
        'admin.organization_step_completion_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
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
      const { organization_id, fullname } = req.payload.user;
      const getCardData = await models.UserCards.findOne({
        where: { user_id: organization_id, is_default: 1 },
        order: [['user_card_id', 'DESC']],
      });
      const getSubscriptionData = await models.SubscriptionHistory.findOne({
        where: {
          user_id: organization_id,
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
              user_id: organization_id,
              payment_status: 1,
              subscription_status: 3,
            },
          });
        await createSubscriptionPayment(
          100,
          getCardData.card_id,
          getCardData.pay_id,
          fullname,
          organization_id,
          getCancelSubscriptionData
            ? moment(getCancelSubscriptionData.renewed_date).format(
                'YYYY-MM-DD'
              )
            : moment().format('YYYY-MM-DD')
        )
          .then(async (getSubscription) => {
            const transactionData =
              getSubscription.data.data.createRecurringPayment;
            if (transactionData) {
              if (['SUCCESS'].includes(transactionData.status)) {
                await models.SubscriptionHistory.update(
                  {
                    subscription_status: 1,
                  },
                  {
                    where: {
                      user_id: organization_id,
                      payment_status: 1,
                      subscription_status: { [Op.or]: [2, 4] },
                    },
                  }
                );
                await models.SubscriptionHistory.create({
                  user_id: organization_id,
                  card_no: getCardData.card_last_digit,
                  card_id: getCardData.card_id,
                  payment_status: 1,
                  subscription_status: 2,
                  transaction_id: transactionData.recurring_id,
                  plan_amount: parseFloat(
                    transactionData.total_amount_per_payment / 100
                  ),
                  plan_id: transactionData.payment_interval,
                  start_date: getCancelSubscriptionData
                    ? moment(getCancelSubscriptionData.renewed_date).format(
                        'YYYY-MM-DD'
                      )
                    : transactionData.prev_payment_date,
                  renewed_date: getCancelSubscriptionData
                    ? moment(getCancelSubscriptionData.renewed_date)
                        .add(7, 'days')
                        .format('YYYY-MM-DD')
                    : transactionData.next_payment_date,
                });
              } else {
                throw new Error('admin.subscripon_not_success');
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      return response.successResponse(
        req,
        res,
        'admin.organization_subscription_info_save_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name organizationSubscriptionDetailsUpdate
   * @description Update Organization Subscription Data.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async organizationSubscriptionDetailsUpdate(req, res) {
    try {
      const { organization_id } = req.payload.user;
      const getCardData = await models.UserCards.findOne({
        where: { user_id: organization_id, is_default: 1 },
        order: [['user_card_id', 'DESC']],
      });
      const getSubscriptionData = await models.SubscriptionHistory.findOne({
        where: {
          user_id: organization_id,
          payment_status: 1,
          subscription_status: { [Op.or]: [2, 4] },
        },
        order: [['subscription_history_id', 'desc']],
      });
      if (getCardData && getSubscriptionData) {
        await updateSubscriptionPayment(
          getCardData.card_id,
          getSubscriptionData.transaction_id
        ).then(async (getSubscription) => {
          const transactionData =
            getSubscription.data.data.updateRecurringPayment;
          if (transactionData) {
            if (['SUCCESS'].includes(transactionData.status)) {
              await models.SubscriptionHistory.update(
                {
                  card_id: getCardData.card_id,
                  card_no: getCardData.card_last_digit,
                },
                {
                  where: {
                    user_id: organization_id,
                    payment_status: 1,
                    subscription_status: { [Op.or]: [2, 4] },
                  },
                  order: [['subscription_history_id', 'desc']],
                }
              );
            }
          }
        });
        return response.successResponse(
          req,
          res,
          'admin.organization_subscription_update_successfully'
        );
      }
      return response.errorResponse(
        req,
        res,
        'admin.organization_subscription_update_not_successfully'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name organizationSubscriptionDetailsCancel
   * @description Cancel Organization Subscription Data.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async organizationSubscriptionDetailsCancel(req, res) {
    try {
      const { organization_id } = req.payload.user;
      await models.SubscriptionHistory.findOne({
        where: {
          user_id: organization_id,
          payment_status: 1,
          subscription_status: { [Op.or]: [2, 4] },
        },
      }).then(async (obj) => {
        if (obj) {
          await cancelSubscription(obj.transaction_id).then((responses) => {
            const transactionData = responses.data.data.cancelRecurringPayment;
            if (transactionData === true) {
              obj.update({
                cancelled_date: new Date(),
                subscription_status: 3,
              });
            }
          });
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
   * @name organizationSubscriptionDataStore
   * @description Store Organization Subscription Data.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async organizationSubscriptionDataStore(req, res) {
    try {
      const { organization_id, fullname } = req.payload.user;
      const { type, card_id, pay_id, card_last_digit, expire_date } = req.body;
      const getSettingData = await getSettingvalue(
        'home_page_general_email_address'
      );
      const isEmailSent = await sendEmail({
        to: getSettingData || 'admin.telepath@yopmail.com',
        template: 'telepath-organization-step-done',
        replacements: {
          FIRSTNAME: 'Admin',
          ORGNAME: fullname,
          PROFILEURL: `${process.env.ADMIN_URL}/organisation/subscription-details/${organization_id}`,
        },
      });
      const getSubscriptionData = await models.SubscriptionHistory.findOne({
        where: {
          user_id: organization_id,
          payment_status: 1,
          subscription_status: { [Op.or]: [2, 4] },
        },
      });
      const getCancelSubscriptionData =
        await models.SubscriptionHistory.findOne({
          where: {
            user_id: organization_id,
            payment_status: 1,
            subscription_status: 3,
          },
        });
      let is_subscription_active = 2;
      if (!getSubscriptionData && !getCancelSubscriptionData) {
        is_subscription_active = 1;
      } else if (
        getSubscriptionData &&
        !getCancelSubscriptionData &&
        moment(getSubscriptionData.renewed_date).format('YYYY-MM-DD') <=
          moment().format('YYYY-MM-DD')
      ) {
        is_subscription_active = 1;
      } else if (
        !getSubscriptionData &&
        getCancelSubscriptionData &&
        moment(getCancelSubscriptionData.renewed_date).format('YYYY-MM-DD') <=
          moment().format('YYYY-MM-DD')
      ) {
        is_subscription_active = 1;
      }
      if (is_subscription_active === 1) {
        if (!isEmailSent)
          throw new Error('admin.organization_step_completion_not_success');
        else {
          const getCardData = await models.UserCards.findOne({
            where: { user_id: organization_id, is_default: 1 },
            order: [['user_card_id', 'DESC']],
          });
          if (getCardData) {
            await models.UserCards.update(
              {
                type,
                card_id,
                pay_id,
                card_last_digit,
                expire_date,
              },
              {
                where: { user_card_id: getCardData.user_card_id },
              }
            );
          } else {
            await models.UserCards.create({
              user_id: organization_id,
              is_default: 1,
              type,
              card_id,
              pay_id,
              card_last_digit,
              expire_date,
            });
          }
        }
        return response.successResponse(
          req,
          res,
          'admin.organization_subscription_request_successfully'
        );
      }
      return response.successResponse(
        req,
        res,
        'admin.organization_subscription_info_save_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name getOrgDashboardData
   * @description get Organization Dashboard Data.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async getOrgDashboardData(req, res) {
    try {
      const { organization_id } = req.payload.user;

      const unreadMessageCount = await models.UserChat.count({
        where: {
          to_user_id: organization_id,
          is_seen: 1,
        },
      });
      const PendingRXCount = await models.Orders.count({
        where: {
          organization_id,
          payment_status: 1,
          order_status: 2,
        },
      });
      const totalOrders = await models.UserTransactions.findOne({
        where: {
          organization_id,
          payment_status: 1,
          type: { [Op.in]: [1, 2] },
        },
        attributes: [
          [Sequelize.literal('count(DISTINCT orders.order_id)'), 'count'],
          [
            Sequelize.literal(
              'coalesce(sum(amount),0.00)-coalesce(sum(refunded_amount),0.00)'
            ),
            'total_amounts',
          ],
        ],
        include: [
          {
            model: models.Orders,
            as: 'orders',
            require: true,
            where: {
              organization_id,
              payment_status: 1,
              order_status: { [Op.in]: [2, 4, 5, 6] },
            },
          },
        ],
        group: ['UserTransactions.organization_id'],
      });
      let total_visiter = 0;
      let total_price = 0;
      let price_cal_check = 1;
      let visiter_cal_check = 1;
      let total_price_cal = 0;
      let total_visiter_cal = 0;
      const start_date_time = `${moment().format('YYYY-MM-DD')}T00:00:00.000Z`;
      const end_date_time = `${moment(start_date_time)
        .subtract(1, 'months')
        .format('YYYY-MM-DD')}T00:00:00.000Z`;
      const end_last_date_time = `${moment(start_date_time)
        .subtract(2, 'months')
        .format('YYYY-MM-DD')}T00:00:00.000Z`;
      let totalCurrentMonthOrders = {};
      let totalPreviousMonthOrders = {};
      if (totalOrders) {
        total_visiter = parseInt(totalOrders.dataValues.count, 10);
        total_price = parseFloat(totalOrders.dataValues.total_amounts);
        totalCurrentMonthOrders = await models.UserTransactions.findOne({
          where: {
            organization_id,
            payment_status: 1,
            type: { [Op.in]: [1, 2] },
          },
          include: [
            {
              model: models.Orders,
              as: 'orders',
              require: true,
              where: {
                organization_id,
                payment_status: 1,
                order_status: { [Op.in]: [2, 4, 5, 6] },
                created_at: {
                  [Op.gte]: end_date_time,
                  [Op.lte]: start_date_time,
                },
              },
            },
          ],
          attributes: [
            [Sequelize.literal('count(DISTINCT orders.order_id)'), 'count'],
            [
              Sequelize.literal(
                'coalesce(sum(amount),0.00)-coalesce(sum(refunded_amount),0.00)'
              ),
              'total_amounts',
            ],
          ],
          group: ['UserTransactions.organization_id'],
        });
        totalPreviousMonthOrders = await models.UserTransactions.findOne({
          where: {
            organization_id,
            payment_status: 1,
            type: { [Op.in]: [1, 2] },
          },
          include: [
            {
              model: models.Orders,
              as: 'orders',
              require: true,
              where: {
                organization_id,
                payment_status: 1,
                order_status: { [Op.in]: [2, 4, 5, 6] },
                created_at: {
                  [Op.gte]: end_last_date_time,
                  [Op.lte]: end_date_time,
                },
              },
            },
          ],
          attributes: [
            [Sequelize.literal('count(DISTINCT orders.order_id)'), 'count'],
            [
              Sequelize.literal(
                'coalesce(sum(amount),0.00)-coalesce(sum(refunded_amount),0.00)'
              ),
              'total_amounts',
            ],
          ],
          group: ['UserTransactions.organization_id'],
        });

        if (totalPreviousMonthOrders && totalCurrentMonthOrders) {
          total_visiter_cal = parseFloat(
            (parseInt(totalCurrentMonthOrders.dataValues.count, 10) /
              parseInt(totalPreviousMonthOrders.dataValues.count, 10)) *
              100
          ).toFixed(2);
          total_price_cal = parseFloat(
            (parseFloat(totalCurrentMonthOrders.dataValues.total_amounts) /
              parseFloat(totalPreviousMonthOrders.dataValues.total_amounts)) *
              100
          ).toFixed(2);
          if (
            parseInt(totalCurrentMonthOrders.dataValues.count, 10) <
            parseInt(totalPreviousMonthOrders.dataValues.count, 10)
          ) {
            visiter_cal_check = 2;
          }
          if (
            parseFloat(totalCurrentMonthOrders.dataValues.total_amounts) <
            parseFloat(totalPreviousMonthOrders.dataValues.total_amounts)
          ) {
            price_cal_check = 2;
          }
        }
      }
      return response.successResponse(
        req,
        res,
        'admin.get_organization_dashboard_successfully',
        {
          unread_message_count: unreadMessageCount,
          pending_rx_count: PendingRXCount,
          total_visiter,
          total_price,
          total_visiter_cal,
          total_price_cal,
          visiter_cal_check,
          price_cal_check,
          totalCurrentMonthOrders,
          totalPreviousMonthOrders,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name organizationDosespotSync
   * @description cancel Organization Dosespot Sync Data.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async organizationDosespotSync(req, res) {
    try {
      const { organization_id } = req.payload.user;
      await organizationDataSync(organization_id);

      return response.successResponse(
        req,
        res,
        'admin.organization_dosespot_sync_save_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name patientList
   * @description For all Organization Patient List.
   * @param req,res
   * @returns {Json} success
   */
  async patientList(req, res) {
    try {
      const { organization_id } = req.payload.user;
      const patientData = await models.Users.scope(['defaultScope']).findAll({
        where: {
          organation_id: organization_id,
          admin_status: 1,
          user_status: 1,
          user_type: 3,
        },
        order: [['first_name', 'ASC']],
      });
      return response.successResponse(
        req,
        res,
        'admin.organization_get_patient_list_succss',
        patientData,
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name listPatient
   * @description Get All Patient Data.
   * @param req,res
   * @returns {Json} success
   */
  async listPatient(req, res) {
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

      const { user_id } = req.payload.user;
      const wherecondition = [];
      wherecondition.push({ user_type: 3, organation_id: user_id });
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
          'country_id',
          'phone',
          'admin_status',
          'user_status',
          'profile_setup',
          'created_at',
        ],
      };
      if (admin_status) {
        wherecondition.push({ admin_status });
      }
      if (user_status) {
        wherecondition.push({ user_status });
      }
      if (profile_status) {
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

      await Promise.all(
        docs.map(async (v) => {
          const data = v.dataValues;
          console.log('Data', v.dataValues.user_id);
          const { phone_code } = await models.Countries.findOne({
            where: {
              country_id: v.dataValues.country_id,
            },
          });
          await models.UserChatRoom.findOne({
            where: {
              user_id: v.dataValues.user_id,
              organization_id: user_id,
            },
          }).then(async (obj) => {
            if (!obj) {
              data.user_chat_room_id = v.dataValues.user_id;
              data.type = 'user';
            } else {
              data.user_chat_room_id = obj.user_chat_room_id;
              data.type = 'room';
            }
          });
          data.phone_code = phone_code;
          return data;
        })
      );
      return response.successResponse(
        req,
        res,
        'admin.get_staff_list_success',
        {
          pagination: {
            total,
            count: docs.length,
            current_page: page,
            last_page: pages,
            per_page: PaginationLength.getOrganization(),
            hasMorePages: pages > parseInt(page, 10),
          },
          patient_list: docs,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new OrganizationController();
