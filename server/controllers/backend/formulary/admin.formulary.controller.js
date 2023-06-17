const { Op } = require('sequelize');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');
const PaginationLength = require('../../../config/pagination.config');
const { deletefile, fileUploadUrl } = require('../../../helpers/s3file.helper');
const { getFolderConfig } = require('../../../config/upload.config');

class FormularyController {
  /**
   * @name addFormulary
   * @description Store Formulary Data.
   * @param req,res
   * @returns {Json} success
   */
  async addFormulary(req, res) {
    try {
      const {
        name,
        dosage_amount,
        ndc,
        price,
        description,
        short_description,
        sequence,
        status,
        is_appointment_required,
        packing_shipping_fee,
      } = req.body;
      const uploadPromises = [];
      await models.Formulary.create({
        name,
        dosage_amount,
        ndc,
        price,
        description,
        short_description,
        sequence,
        status,
        is_appointment_required,
        packing_shipping_fee: packing_shipping_fee || null,
      }).then(async (dataSave) => {
        req.files.map(async (file) => {
          const fileFolderPath =
            getFolderConfig()[
              file.fieldname === 'featured_image'
                ? 'featured_image'
                : 'formulary_image'
            ];
          const folder_path = fileFolderPath.file_path.replace(
            fileFolderPath.replace,
            dataSave.formulary_id
          );
          const fileurl = await fileUploadUrl(file, folder_path);
          if (fileurl) {
            const pathArray = fileurl.filename.split('/');
            const file_name = pathArray[pathArray.length - 1];
            if (file.fieldname === 'featured_image') {
              dataSave.featured_image = file_name;
              dataSave.save();
            } else {
              await models.FormularyImage.create({
                image_name: file_name,
                formulary_id: dataSave.formulary_id,
              });
            }
          }

          uploadPromises.push(fileurl);
        });
      });
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.create_formulary_success',
          uploadPromises
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name editFormulary
   * @description Update Formulary Data.
   * @param req,res
   * @returns {Json} success
   */
  async editFormulary(req, res) {
    try {
      const {
        formulary_id,
        name,
        dosage_amount,
        ndc,
        price,
        description,
        short_description,
        sequence,
        status,
        is_appointment_required,
        packing_shipping_fee,
      } = req.body;
      const pathArray =
        req.body.featured_image !== undefined
          ? req.body.featured_image.split('/')
          : [];
      const pathArray2 =
        pathArray.length > 0 ? pathArray[pathArray.length - 1].split('?') : [];
      const featured_image =
        pathArray2.length > 0 ? pathArray2[pathArray2.length - 2] : '';
      const uploadPromises = [];
      await models.Formulary.update(
        {
          name,
          dosage_amount,
          ndc,
          price,
          featured_image,
          description,
          short_description,
          sequence,
          status,
          is_appointment_required,
          packing_shipping_fee: packing_shipping_fee || null,
        },
        {
          where: {
            formulary_id,
          },
        }
      ).then(async () => {
        req.files.map(async (file) => {
          const fileFolderPath =
            getFolderConfig()[
              file.fieldname === 'featured_image'
                ? 'featured_image'
                : 'formulary_image'
            ];
          const folder_path = fileFolderPath.file_path.replace(
            fileFolderPath.replace,
            formulary_id
          );
          const fileurl = await fileUploadUrl(file, folder_path);
          if (fileurl) {
            const pathArray1 = fileurl.filename.split('/');
            const file_name = pathArray1[pathArray1.length - 1];
            if (file.fieldname === 'featured_image') {
              await models.Formulary.update(
                {
                  featured_image: file_name,
                },
                {
                  where: {
                    formulary_id,
                  },
                }
              );
            } else {
              await models.FormularyImage.create({
                image_name: file_name,
                formulary_id,
              });
            }
          }

          uploadPromises.push(fileurl);
        });
      });

      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.update_formulary_success',
          uploadPromises
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name formularyStatusUpdate
   * @description Update Status Change in formulary
   * @param req,res
   * @return {Json} success
   */
  async formularyStatusUpdate(req, res) {
    try {
      const { formulary_id } = req.body;
      const getFormularyData = await models.Formulary.findOne({
        where: {
          formulary_id,
        },
      });
      if (getFormularyData) {
        await models.Formulary.update(
          {
            status: getFormularyData.status === 1 ? 2 : 1,
          },
          {
            where: {
              formulary_id,
            },
          }
        );
        return response.successResponse(
          req,
          res,
          'admin.update_status_formulary_success'
        );
      }
      return response.successResponse(
        req,
        res,
        'admin.update_status_formulary_success_not'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name listFormulary
   * @description Get All Formulary Data.
   * @param req,res
   * @returns {Json} success
   */
  async listFormulary(req, res) {
    try {
      const { page, serach_text, status } = req.query;
      const wherecondition = [];
      wherecondition.push({
        name: {
          [Op.like]: `%${serach_text}%`,
        },
      });
      const condition = {
        attributes: [
          'formulary_id',
          'name',
          'dosage_amount',
          'featured_image',
          'ndc',
          'price',
          'description',
          'short_description',
          'sequence',
          'status',
          'packing_shipping_fee',
          'created_at',
        ],
      };
      if (status !== '') {
        wherecondition.push({ status });
      }
      condition.where = wherecondition;
      condition.page = page;
      condition.paginate = PaginationLength.getFormulary();
      condition.order = [['formulary_id', 'DESC']];
      const { docs, pages, total } = await models.Formulary.paginate(condition);
      const dataList = [];
      docs.map(async (value, index) => {
        const data = value.dataValues;
        data.status = value.status;
        data.featured_image = await value.featured_image.then(
          (dataUrl) => dataUrl
        );
        dataList[index] = data;
        return value;
      });
      return setTimeout(() => {
        response.successResponse(req, res, 'admin.get_formulary_success', {
          pagination: {
            total,
            count: docs.length,
            current_page: page,
            last_page: pages,
            per_page: PaginationLength.getFormulary(),
            hasMorePages: pages > parseInt(page, 10),
          },
          formulary_list: dataList,
        });
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getFormulary
   * @description Get Formulary Data.
   * @param req,res
   * @returns {Json} success
   */
  async getFormulary(req, res) {
    try {
      const { formulary_id } = req.query;
      const getFormulary = await models.Formulary.findOne({
        where: {
          formulary_id,
        },
        include: [
          {
            model: models.FormularyImage,
            as: 'formulary_image',
          },
        ],
      });
      const getFormularyData = getFormulary.dataValues;
      getFormularyData.featured_image = await getFormulary.featured_image.then(
        (dataUrl) => dataUrl
      );
      getFormularyData.status = getFormulary.status;
      getFormularyData.is_appointment_required =
        getFormulary.is_appointment_required;
      getFormularyData.formulary_image = [];
      if (getFormulary && getFormulary.formulary_image) {
        getFormulary.formulary_image.forEach(async (value) => {
          getFormularyData.formulary_image.push({
            image_name: await value.image_name.then((dataUrl) => dataUrl),
            formulary_image_id: value.formulary_image_id,
            formulary_id: value.formulary_id,
          });
        });
      }
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.get_formulary_success',
          getFormularyData
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name deleteFormularyImage
   * @description delete Formulary Image Data.
   * @param req,res
   * @returns {Json} success
   */
  async deleteFormularyImage(req, res) {
    try {
      const { formulary_image_id } = req.query;
      const formularyImageData = await models.FormularyImage.findOne({
        where: {
          formulary_image_id,
        },
      });
      const url = await formularyImageData.image_name.then(
        (dataUrl) => dataUrl
      );
      deletefile(url.replace(`${process.env.AWS_URL}/`, ''));
      formularyImageData.destroy();

      return response.successResponse(
        req,
        res,
        'admin.delete_formulary_image_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getFormularyQuestion
   * @description Get Formulary Question Data.
   * @param req,res
   * @returns {Json} success
   */
  async getFormularyQuestion(req, res) {
    try {
      const { user_id, formulary_id } = req.query;
      const condition = {
        formulary_id,
      };
      if (user_id) {
        condition.user_id = user_id;
      } else {
        condition.old_question_id = {
          [Op.is]: null,
        };
      }

      const getOrganizationFormularyQuestionData =
        await models.Questions.findAll({
          where: condition,
          order: [['question_id', 'ASC']],
          include: [{ model: models.QuestionOptions, as: 'question_options' }],
        });
      return response.successResponse(
        req,
        res,
        'admin.get_formulary_question_success',
        getOrganizationFormularyQuestionData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationFormularyData
   * @description Get Organization Formulary Data.
   * @param req,res
   * @returns {Json} success
   */
  async getOrganizationFormularyData(req, res) {
    try {
      const { user_id, page } = req.query;
      const { docs, total, pages } =
        await models.OrganizationFormulary.paginate({
          where: { organization_id: user_id },
          include: [
            {
              model: models.Formulary,
              as: 'formulary',
            },
          ],
          page,
          paginate: PaginationLength.getFormulary(),
        });
      const dataList = [];
      docs.map(async (value, index) => {
        const data = value.dataValues;
        data.prescription_product = value.prescription_product;
        data.top_discount_product = value.top_discount_product;
        data.popular_product = value.popular_product;
        data.formulary = value.dataValues.formulary.dataValues;
        data.formulary.status = value.formulary.status;
        data.formulary.featured_image =
          await value.formulary.featured_image.then((dataUrl) => dataUrl);
        dataList[index] = data;
        return value;
      });
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.get_organization_formulary_success',
          {
            pagination: {
              total,
              count: docs.length,
              current_page: page,
              last_page: pages,
              per_page: PaginationLength.getFormulary(),
              hasMorePages: pages > parseInt(page, 10),
            },
            getOrganizationFormularyData: dataList,
          }
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name deleteFormulary
   * @description Delete Formulary api
   * @param req
   * @param res
   * @returns { Json } success
   */
  async deleteFormularyData(req, res) {
    try {
      const { formulary_id } = req.query;
      const organizationFormularyData =
        await models.OrganizationFormulary.findOne({
          where: {
            formulary_id,
          },
        });
      if (organizationFormularyData) {
        throw new Error('admin.formulary_id_already_use');
      } else {
        await models.Formulary.destroy({
          where: {
            formulary_id,
          },
        });
        await models.FormularyImage.destroy({
          where: {
            formulary_id,
          },
        });
      }
      return response.successResponse(
        req,
        res,
        'admin.formulary_delete_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new FormularyController();
