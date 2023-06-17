const { Op, Sequelize } = require('sequelize');
// const moment = require('moment');

const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');
const { encryptValues } = require('../../../helpers/common.helper');
const PaginationLength = require('../../../config/pagination.config');
const { organizationSendEmail } = require('../../../helpers/email.helper');
// const { organizationDataSync } = require('../../../helpers/dosespot.helper');

class StaffController {
  /**
   * @name listStaff
   * @description Get All Staff Data.
   * @param req,res
   * @returns {Json} success
   */
  async listStaff(req, res) {
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
      wherecondition.push({
        user_type: {
          [Op.in]: [4, 5, 6],
        },
        organation_id: user_id,
      });
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

      await Promise.all(
        docs.map(async (v) => {
          const data = v.dataValues;
          const { phone_code } = await models.Countries.findOne({
            where: {
              country_id: v.dataValues.country_id,
            },
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
          organization_list: docs,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name staffAdd
   * @description Add Staff.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */

  async staffAdd(req, res) {
    try {
      const {
        first_name,
        last_name,
        email,
        admin_status,
        user_status,
        country_id,
        phone,
        type,
      } = req.body;
      const { user_id } = req.payload.user;
      let staffData = {};
      if (type === 5 || type === 6) {
        staffData = {
          first_name,
          last_name,
          email,
          account_type: 1,
          user_type: type,
          admin_status,
          user_status,
          profile_setup: 2,
          country_id,
          phone,
          organation_id: user_id,
        };
      } else {
        staffData = {
          first_name,
          last_name,
          email,
          account_type: 1,
          user_type: 4,
          admin_status,
          user_status,
          profile_setup: 1,
          country_id,
          phone,
          organation_id: user_id,
        };
      }
      /** ***Check Email Already Exists******* */
      const isEmailExists = await models.Users.findOne({
        where: { email },
      });
      if (isEmailExists) {
        throw new Error('admin.staff_email_already_register_with_account');
      }

      const staff = await models.Users.create(staffData);
      const { company_name } = await models.OrganizationInfo.findOne({
        where: {
          user_id,
        },
      });

      const encodedToken = Buffer.from(staff.user_id.toString()).toString(
        'base64'
      );
      const staff_user_id = encryptValues(staff.user_id);
      const { FRONT_URL } = process.env;
      const template = 'telepath-staff-registration';
      const link = `${FRONT_URL}/set-password/${staff_user_id}`;
      const isEmailSent = await organizationSendEmail({
        to: staff.email,
        organization_id: user_id,
        template,
        replacements: {
          FIRSTNAME: `${staff.first_name}`,
          ORGANIZATIONNAME: `${company_name}`,
          PASSWORDLINK: link,
        },
      });

      if (!isEmailSent) {
        throw new Error('admin.staff_add_fail_send_mail');
      }
      return response.successResponse(req, res, 'admin.staff_add_success', {
        encodedToken,
      });
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name getStaff
   * @description Get Staff Data For Edit.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */

  async getStaff(req, res) {
    try {
      const { user_id } = req.params;
      const staffData = await models.Users.findOne({
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
          'organation_id',
          'user_type',
        ],
        where: {
          user_id,
        },
      });
      const organization_info = await models.OrganizationInfo.findOne({
        where: {
          user_id: staffData.organation_id,
        },
      });
      const getStaffData = {
        first_name: staffData.first_name,
        last_name: staffData.last_name,
        email: staffData.email,
        admin_status: staffData.admin_status,
        user_status: staffData.user_status,
        user_type: staffData.user_type,
        reason: staffData.reason,
        user_reason: staffData.user_reason,
        dob: staffData.dob,
        phone: staffData.phone,
        country_id: staffData.country_id,
        timezone_id: staffData.timezone_id,
        npi_number: organization_info.npi_number,
        address: organization_info.address,
        city: organization_info.city,
        state: organization_info.state,
        postcode: organization_info.postcode,
        country: organization_info.country,
        profile_image: await staffData.profile_image.then((dataUrl) => dataUrl),
      };
      if (staffData.timezone_id !== null) {
        const timezoneData = await models.Timezones.findOne({
          where: {
            timezone_id: staffData.timezone_id,
          },
          attributes: ['text'],
        });
        getStaffData.text = timezoneData.text;
      } else {
        getStaffData.text = '';
      }
      return response.successResponse(
        req,
        res,
        'admin.get_staff_success',
        getStaffData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name editStaff
   * @description Update Staff Data.
   * @param req,res
   * @returns {Json} success
   */
  async editStaff(req, res) {
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
      } = req.body;
      let { reason } = req.body;
      const isEmailExists = await models.Users.findOne({
        where: {
          email,
          user_id: {
            [Op.not]: user_id,
          },
        },
      });
      if (isEmailExists) {
        throw new Error('admin.staff_email_already_register_with_account');
      }
      const getStaffData = await models.Users.findOne({
        where: {
          user_id,
        },
      });
      const { company_name } = await models.OrganizationInfo.findOne({
        where: {
          user_id: getStaffData.organation_id,
        },
      });
      if (
        getStaffData.admin_status === 1 &&
        admin_status !== getStaffData.admin_status
      ) {
        const isEmailSent = await organizationSendEmail({
          to: getStaffData.email,
          organization_id: getStaffData.organation_id,
          template: 'telepath-organization-staff-deactivate-account',
          replacements: {
            FIRSTNAME: `${getStaffData.first_name}`,
            ORGANIZATIONNAME: `${company_name}`,
            REASON: reason,
          },
        });
        if (!isEmailSent) {
          throw new Error('admin.staff_deactivate_mail_not_sent');
        }
      }
      if (
        getStaffData.admin_status === 2 &&
        admin_status !== getStaffData.admin_status
      ) {
        reason = null;
        const isEmailSent = await organizationSendEmail({
          to: getStaffData.email,
          organization_id: getStaffData.organation_id,
          template: 'telepath-organization-staff-activate-account',
          replacements: {
            FIRSTNAME: `${getStaffData.first_name}`,
            ORGANIZATIONNAME: `${company_name}`,
          },
        });
        if (!isEmailSent) {
          throw new Error('admin.staff_activate_mail_not_sent');
        }
      }

      const updateStaffData = await models.Users.update(
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

      return response.successResponse(req, res, 'admin.staff_update_success', {
        user_id: updateStaffData.user_id,
      });
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name staffAdminUserStatusUpdate
   * @description Update User Status And Admin Status
   * @param req,res
   * @return {Json} success
   */
  async staffAdminUserStatusUpdate(req, res) {
    try {
      const { user_id, type, reason } = req.body;
      let msg = '';
      const getStaffData = await models.Users.findOne({
        where: {
          user_id,
        },
      });
      const { company_name } = await models.OrganizationInfo.findOne({
        where: {
          user_id: getStaffData.organation_id,
        },
      });
      if (getStaffData) {
        if (type === 'admin') {
          getStaffData.admin_status = getStaffData.admin_status === 1 ? 2 : 1;
          msg = 'admin.staff_update_admin_status_success';
        }
        if (type === 'user') {
          getStaffData.user_status = getStaffData.user_status === 1 ? 2 : 1;
          msg = 'admin.staff_update_user_status_success';
        }
      }
      getStaffData.save();
      if (getStaffData.admin_status === 2 && type === 'admin') {
        getStaffData.reason = reason;
        getStaffData.save();
        const isEmailSent = await organizationSendEmail({
          to: getStaffData.email,
          organization_id: getStaffData.organation_id,
          template: 'telepath-organization-staff-deactivate-account',
          replacements: {
            FIRSTNAME: `${getStaffData.first_name}`,
            ORGANIZATIONNAME: `${company_name}`,
            REASON: reason,
          },
        });
        if (!isEmailSent) {
          throw new Error('admin.staff_deactivate_mail_not_sent');
        }
      }
      if (getStaffData.admin_status === 1 && type === 'admin') {
        getStaffData.reason = null;
        getStaffData.save();
        const isEmailSent = await organizationSendEmail({
          to: getStaffData.email,
          organization_id: getStaffData.organation_id,
          template: 'telepath-organization-staff-activate-account',
          replacements: {
            FIRSTNAME: `${getStaffData.first_name}`,
            ORGANIZATIONNAME: `${company_name}`,
          },
        });
        if (!isEmailSent) {
          throw new Error('admin.staff_activate_mail_not_sent');
        }
      }
      return response.successResponse(req, res, msg);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name deleteStaffData
   * @description Delete Staff api
   * @param req
   * @param res
   * @returns { Json } success
   */
  async deleteStaffData(req, res) {
    try {
      const { user_id } = req.query;
      await models.Users.destroy({
        where: {
          user_id,
        },
      });
      return response.successResponse(
        req,
        res,
        'admin.staff_user_delete_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name staffGeneralInfoStore
   * @description Store Staff general Info Data.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async staffGeneralInfoStore(req, res) {
    try {
      const { user_id } = req.payload.user;
      const {
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
      const userData = await models.Users.findOne({
        where: {
          user_id,
        },
      });
      const staffData = {
        npi_number,
        address,
        city,
        state,
        postcode,
        country,
        user_id,
        organation_id: userData.organation_id,
      };
      await models.OrganizationStaffInfo.findOne({
        where: {
          user_id,
        },
      }).then(async (obj) => {
        // update
        if (obj) {
          const updateStaffInfoData = await obj.update(staffData);
          return updateStaffInfoData;
        }
        // insert
        return models.OrganizationStaffInfo.create(staffData);
      });
      await models.Users.update(
        { dob, phone, country_id, profile_setup: 1 },
        {
          where: { user_id },
        }
      );
      return response.successResponse(
        req,
        res,
        'admin.staff_general_info_save_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getStaffInfo
   * @description Get Staff info Data.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async getStaffInfo(req, res) {
    try {
      const { user_id } = req.payload.user;
      const getStaffData = await await models.Users.scope(
        'withUserTypeColumns'
      ).findOne({
        where: {
          user_id,
          user_type: { [Op.in]: [4, 5, 6] },
        },
        include: [
          {
            model: models.OrganizationStaffInfo,
            as: 'organization_staff_infos',
          },
        ],
      });
      const userData = {
        is_email_verified: getStaffData.is_email_verified,
        admin_status: getStaffData.admin_status,
        user_status: getStaffData.user_status,
        profile_setup: getStaffData.profile_setup,
        user_id: getStaffData.user_id,
        first_name: getStaffData.first_name,
        last_name: getStaffData.last_name,
        email: getStaffData.email,
        country_id: getStaffData.country_id,
        timezone_id: getStaffData.timezone_id,
        phone: getStaffData.phone,
        dob: getStaffData.dob,
        organation_id: getStaffData.organation_id,
        facebook_id: getStaffData.facebook_id,
        gmail_id: getStaffData.gmail_id,
        user_type: getStaffData.user_type,
      };
      if (getStaffData.organization_staff_infos) {
        userData.organization_staff_infos =
          getStaffData.organization_staff_infos.dataValues;
      } else {
        userData.organization_staff_infos = '';
      }
      return response.successResponse(
        req,
        res,
        'admin.get_staff_info_success',
        userData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new StaffController();
