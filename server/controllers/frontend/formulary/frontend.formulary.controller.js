const { Op, Sequelize } = require('sequelize');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');

class FormularyController {
  /**
   * @name getFormularyList
   * @description  get All Formulary Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getFormularyList(req, res) {
    try {
      const { organization_id } = req.payload.user;
      const getUserFormularyData = await models.OrganizationFormulary.findAll({
        attributes: {
          include: ['formulary_id'],
        },
        order: [['organization_formulary_id', 'ASC']],
        where: { organization_id },
      });
      let wherecondition = {};
      if (getUserFormularyData.length !== 0) {
        wherecondition = {
          where: {
            formulary_id: {
              [Op.notIn]: getUserFormularyData.map(
                (value) => value.formulary_id
              ),
            },
          },
        };
      }
      const getFormularyData = await models.Formulary.scope([
        'defaultScope',
        'getFormularyData',
      ]).findAll({
        ...wherecondition,
        order: [
          ['sequence', 'ASC'],
          ['name', 'ASC'],
        ],
      });
      const dataList = [];
      getFormularyData.forEach(async (value, index) => {
        const data = value.dataValues;
        data.status = value.status;
        data.featured_image = await value.featured_image.then(
          (dataUrl) => dataUrl
        );
        dataList[index] = data;
      });
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.get_formulary_success',
          dataList
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name organizationFormularyDataStore
   * @description Organization Formulary Data Store in database.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async organizationFormularyDataStore(req, res) {
    try {
      const { organization_formulary, type } = req.body;
      const { organization_id } = req.payload.user;
      Object.values(organization_formulary).map(async (item) => {
        item.organization_id = organization_id;
        await models.OrganizationFormulary.findOne({
          where: {
            organization_formulary_id: item.organization_formulary_id,
          },
        }).then(async (obj) => {
          // update
          if (
            obj &&
            obj.patient_price !== parseFloat(item.patient_price).toFixed(2)
          ) {
            await models.OrderItems.findAll({
              where: {
                formulary_id: item.formulary_id,
                organization_id: item.organization_id,
              },
              include: [
                {
                  model: models.Orders,
                  as: 'orders',
                  where: {
                    organization_id: item.organization_id,
                    payment_status: 2,
                    order_status: 1,
                  },
                },
              ],
            }).then(async (objo) => {
              if (objo) {
                objo.map(async (value) => {
                  const orderData = await models.Orders.findOne({
                    where: {
                      order_id: value.order_id,
                      organization_id: item.organization_id,
                      payment_status: 2,
                      order_status: 1,
                    },
                  });
                  if (orderData) {
                    const subTotal =
                      parseFloat(item.patient_price) * parseFloat(value.qty);
                    await models.OrderItems.update(
                      {
                        price: item.patient_price,
                        sub_total: subTotal,
                      },
                      {
                        where: {
                          order_item_id: value.order_item_id,
                        },
                      }
                    );
                    const totalAmount = await models.OrderItems.findOne({
                      where: {
                        order_id: value.order_id,
                      },
                      attributes: [
                        [
                          Sequelize.fn('sum', Sequelize.col('sub_total')),
                          'total_amount',
                        ],
                      ],
                      group: ['order_id'],
                      raw: true,
                    });
                    const amount = totalAmount.total_amount;
                    await models.Orders.update(
                      {
                        total_amount: amount,
                      },
                      {
                        where: {
                          order_id: value.order_id,
                        },
                      }
                    );
                  }
                });
              }
            });
          }
          if (obj && item.is_delete === 1 && item.is_new === 1) {
            await obj.update(item);
          }
          if (obj && item.is_delete === 2 && item.is_new === 1) {
            // delete
            return obj.destroy();
          }
          if (item.is_delete === 1 && item.is_new === 2) {
            // insert
            return models.OrganizationFormulary.create(item);
          }
          return null;
        });
      });
      if (type === 'old') {
        const organizationData = {
          user_id: organization_id,
          fill_step: 7,
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
      }
      return response.successResponse(
        req,
        res,
        'admin.store_formulary_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name organizationFormularyDataDelete
   * @description Organization Formulary Data Delete in database.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async organizationFormularyDataDelete(req, res) {
    try {
      const { organization_formulary_id } = req.query;

      await models.OrganizationFormulary.findOne({
        where: {
          organization_formulary_id,
        },
      }).then(async (obj) => obj.destroy());
      return response.successResponse(
        req,
        res,
        'admin.delete_formulary_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getFormularyData
   * @description Get Organization Formulary Data.
   * @param req,res
   * @returns {Json} success
   */
  async getFormularyData(req, res) {
    try {
      const { organization_id } = req.payload.user;
      const getFormularyData = await models.OrganizationFormulary.findAll({
        attributes: {
          exclude: ['created_at', 'updated_at', 'deleted_at'],
        },
        order: [['organization_formulary_id', 'ASC']],
        where: { organization_id },
        include: [
          {
            model: models.Formulary.scope('defaultScope'),
            as: 'formulary',
            attributes: {
              exclude: [
                'created_at',
                'updated_at',
                'deleted_at',
                'status',
                'sequence',
              ],
            },
          },
        ],
      });
      const dataList = [];
      if (getFormularyData) {
        getFormularyData.map(async (value, index) => {
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
      }
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.get_formiulary_success1',
          dataList
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new FormularyController();
