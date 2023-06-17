const { Op } = require('sequelize');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');
const PaginationLength = require('../../../config/pagination.config');

class DomainProviderController {
  /**
   * @name addDomainProvider
   * @description Store Domain Provider Data.
   * @param req,res
   * @returns {Json} success
   */
  async addDomainProvider(req, res) {
    try {
      const { email_template_key, title, parameter, subject, content } =
        req.body;
    //   const storeEmailTemplateData = await models.EmailTemplate.create({
    //     email_template_key,
    //     title,
    //     parameter,
    //     subject,
    //     content,
    //   });
      return response.successResponse(
        req,
        res,
        'admin.create_email_template_success',
        {
        //   email_template_id: storeEmailTemplateData.email_template_id,
        }
      );
    } catch (error) {
      if (error.fields && error.fields.email_template_key !== undefined) {
        return response.errorResponse(
          req,
          res,
          'admin.email_template_email_template_key_validation_unique',
          {},
          422
        );
      }
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name editDomainProvider
   * @description Edit Domain Provider Data.
   * @param req,res
   * @returns {Json} success
   */
  async editDomainProvider(req, res) {
    try {
      const {
        email_template_id,
        email_template_key,
        title,
        parameter,
        subject,
        content,
      } = req.body;
    //   const updateEmailTemplateData = await models.EmailTemplate.update(
    //     {
    //       email_template_key,
    //       title,
    //       parameter,
    //       subject,
    //       content,
    //     },
    //     {
    //       where: {
    //         email_template_id,
    //       },
    //     }
    //   );
      return response.successResponse(
        req,
        res,
        'admin.update_email_template_success',
        {
        //   email_template_id: updateEmailTemplateData.email_template_id,
        }
      );
    } catch (error) {
      if (error.fields.email_template_key !== undefined) {
        return response.errorResponse(
          req,
          res,
          'admin.email_template_email_template_key_validation_unique',
          {},
          422
        );
      }
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getDomainProvider
   * @description Get Domain Provider Data.
   * @param req,res
   * @returns {Json} success
   */
  async getDomainProvider(req, res) {
    try {
      const { email_template_id } = req.query;
    //   const getEmailTemplateData = await models.EmailTemplate.findOne({
    //     where: {
    //       email_template_id,
    //     },
    //   });
      return response.successResponse(
        req,
        res,
        'admin.get_email_template_success',
        {}
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name listDomainProvider
   * @description Get All Domain Prvider Data.
   * @param req,res
   * @returns {Json} success
   */
  async listDomainProvider(req, res) {
    try {
      const { page, serach_text } = req.query;
    //   const condition = {
    //     attributes: [
    //       'email_template_id',
    //       'email_template_key',
    //       'title',
    //       'created_at',
    //     ],
    //     where: {
    //       title: {
    //         [Op.like]: `%${serach_text}%`,
    //       },
    //     },
    //   };
    //   condition.page = parseInt(page, 10);
    //   condition.paginate = PaginationLength.getEmailTemplate();
    //   condition.order = [['email_template_id', 'DESC']];
    //   const { docs, pages, total } = await models.EmailTemplate.paginate(
    //     condition
    //   );
      return response.successResponse(
        req,
        res,
        'admin.get_email_template_success',
        {
        //   pagination: {
        //     total,
        //     count: docs.length,
        //     current_page: parseInt(page, 10),
        //     last_page: pages,
        //     per_page: PaginationLength.getEmailTemplate(),
        //     hasMorePages: pages > parseInt(page, 10),
        //   },
        //   email_template_list: docs,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new DomainProviderController();
