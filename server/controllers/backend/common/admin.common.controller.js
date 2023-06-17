const AWS = require('aws-sdk');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');
const { deletefile } = require('../../../helpers/s3file.helper');

class CommonController {
  /**
   * @name countryList
   * @description For Get Country List.
   * @param req,res
   * @returns {Json} success
   */
  async countryList(req, res) {
    try {
      const countrData = await models.Countries.scope([
        'defaultScope',
        'active',
      ]).findAll();
      return response.successResponse(
        req,
        res,
        'admin.backend_login_succss',
        countrData,
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name timezoneList
   * @description For get Timezone List.
   * @param req,res
   * @returns {Json} success
   */
  async timezoneList(req, res) {
    try {
      const timezoneData = await models.Timezones.scope([
        'defaultScope',
      ]).findAll({
        group: ['title'],
      });
      return response.successResponse(
        req,
        res,
        'admin.get_timezone_list_success',
        timezoneData,
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getTimezone
   * @description For get Timezone.
   * @param req,res
   * @returns {Json} success
   */
  async getTimezone(req, res) {
    try {
      const { timezone_id } = req.query;
      const getTimezone = await models.Timezones.findOne({
        where: {
          timezone_id,
        },
        attributes: ['utc'],
      });
      return response.successResponse(
        req,
        res,
        'admin.get_timezone_name_success',
        getTimezone,
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name stateList
   * @description For Get State List.
   * @param req,res
   * @returns {Json} success
   */
  async stateList(req, res) {
    try {
      const stateData = await models.States.scope([
        'defaultScope',
        'active',
      ]).findAll({
        order: [['name', 'ASC']],
      });
      return response.successResponse(
        req,
        res,
        'admin.backend_login_succss',
        stateData,
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name fileUpload
   * @description For all file upload.
   * @param req,res
   * @returns {Json} success
   */
  async fileUpload(req, res) {
    try {
      const { body } = req;
      return response.successResponse(
        req,
        res,
        'admin.file_upload_success',
        body,
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name fileUploadUrl
   * @description For all file upload.
   * @param req,res
   * @returns {Json} success
   */
  async fileUploadUrl(req, res) {
    try {
      const { files } = req;
      AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });
      const s3 = new AWS.S3();
      const file = files[0];
      const file_extension = file.originalname.split('.')[1];
      const random = Math.floor(100000 + Math.random() * 900000);
      const filename = `${Date.now()}_${random}.${file_extension}`;
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: filename,
        ContentType: file.mimetype,
        Expires: 60 * 24,
      };
      const uploadURL = await s3.getSignedUrlPromise('putObject', params);
      return response.successResponse(
        req,
        res,
        'admin.file_upload_success',
        {
          uploadURL,
          filename,
        },
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name fileUploadRemove
   * @description For file Remove.
   * @param req,res
   * @returns {Json} success
   */
  async fileUploadRemove(req, res) {
    try {
      const { url } = req.query;
      deletefile(url.replace(`${process.env.AWS_URL}/`, ''));
      return response.successResponse(
        req,
        res,
        'admin.file_upload_success',
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name patientList
   * @description For Patient List.
   * @param req,res
   * @returns {Json} success
   */
  async patientList(req, res) {
    try {
      const { user_id } = req.query;
      const patientData = await models.Users.scope(['defaultScope']).findAll({
        where: {
          organation_id: user_id,
          admin_status: 1,
          user_status: 1,
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
   * @name getOrgTimezone
   * @description For Organization Timezone.
   * @param req,res
   * @returns {Json} success
   */
  async getOrgTimezone(req, res) {
    try {
      const { user_id } = req.query;
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
      });
      return response.successResponse(
        req,
        res,
        'admin.organization_get_patient_list_succss',
        getTimezone,
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientOrgTimezone
   * @description For Organization Timezone.
   * @param req,res
   * @returns {Json} success
   */
  async getPatientOrgTimezone(req, res) {
    try {
      const { user_id } = req.query;
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
      });
      return response.successResponse(
        req,
        res,
        'admin.organization_get_patient_list_succss',
        getTimezone,
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new CommonController();
