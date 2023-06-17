const { Sequelize, Op } = require('sequelize');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');
const PaginationLength = require('../../../config/pagination.config');
const emailHelper = require('../../../helpers/email.helper');

class TransactioncController {
  /**
   * @name getOrganizationData
   * @description  get All Organization Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getOrganizationData(req, res) {
    try {
      const getOrganizationData = await models.Orders.findAll({
        attributes: ['order_id', 'organization_id'],
        group: ['organization_id'],
        include: [
          {
            model: models.OrganizationInfo,
            as: 'organization_info',
            attributes: [
              [
                Sequelize.literal(`(
                SELECT organization_info_id
                FROM organization_info AS organization_info_table
                WHERE ( organization_info_table.user_id = Orders.organization_id)
            )`),
                'organization_info_id',
              ],
              [
                Sequelize.literal(`(
                SELECT company_name
                FROM organization_info AS organization_info_table
                WHERE ( organization_info_table.user_id = Orders.organization_id)
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
        'admin.get_organization_success',
        getOrganizationData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientData
   * @description  get All Patient Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getPatientData(req, res) {
    try {
      const getPatientData = await models.Orders.findAll({
        attributes: ['order_id', 'user_id'],
        group: ['user_id'],
        include: [
          {
            model: models.Users,
            as: 'users',
            attributes: ['first_name', 'last_name'],
          },
        ],
      });
      return response.successResponse(
        req,
        res,
        'admin.get_patient_success',
        getPatientData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrderTransactionData
   * @description  get All Order Transaction Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getOrderTransactionData(req, res) {
    try {
      const {
        page,
        organization_id,
        patient_id,
        from_date,
        to_date,
        payout_status,
        order_status,
        type,
      } = req.query;
      const condition = [];
      const wherecondition = [
        {
          order_status: {
            [Op.ne]: 1,
          },
        },
      ];
      if (organization_id !== '') {
        condition.push({
          organization_id,
        });
      }
      if (patient_id !== '') {
        condition.push({
          user_id: patient_id,
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
      if (payout_status !== '') {
        wherecondition.push({
          payout_status,
        });
      }
      if (order_status) {
        wherecondition.push({
          order_status,
        });
      }
      if (type) {
        condition.push({
          type,
        });
      } else {
        condition.push({
          type: {
            [Op.in]: [1, 2],
          },
        });
      }
      if (wherecondition.length !== 0) {
        const getOrderData = await models.Orders.findAll({
          where: wherecondition,
        });
        condition.push({
          order_id: {
            [Op.in]: getOrderData.map((v) => v.order_id),
          },
        });
      }

      const parametes = {
        page,
        where: condition,
        paginate: PaginationLength.getOrderTransaction(),
        order: [['order_id', 'DESC']],
        attributes: [
          'user_transaction_id',
          'type',
          'user_id',
          'organization_id',
          'transaction_id',
          'order_id',
          'order_item_id',
          'amount',
          'created_at',
          'refunded_amount',
          [
            Sequelize.literal(`(
                    SELECT company_name
                    FROM organization_info AS organization_info_table
                    WHERE ( organization_info_table.user_id = UserTransactions.organization_id)
                )`),
            'company_name',
          ],
        ],
        include: [
          {
            model: models.Users,
            as: 'users',
            attributes: ['first_name', 'last_name'],
            required: true,
          },
          {
            model: models.Orders,
            as: 'orders',
            where: wherecondition,
            required: true,
            attributes: [
              'order_id',
              'transaction_id',
              'total_amount',
              'user_id',
              'payout_note',
              'organization_id',
              'packing_shipping_fee',
              'doctor_visit_fee',
              'telemedicine_platform_fee',
              'medication_cost',
              'payout_status',
              'payment_status',
              'order_status',
              'created_at',
            ],
          },
          {
            model: models.OrderItems,
            as: 'order_items',
            attributes: [
              'order_item_id',
              'formulary_id',
              'qty',
              'price',
              'sub_total',
            ],
            include: [
              {
                model: models.Formulary,
                as: 'formulary',
                attributes: ['name', 'formulary_id'],
              },
            ],
          },
        ],
      };
      const countData = await models.UserTransactions.count(parametes);
      const { docs, pages } = await models.UserTransactions.paginate(parametes);
      return response.successResponse(
        req,
        res,
        'admin.get_order_transaction_success',
        {
          pagination: {
            total: countData,
            count: docs.length,
            current_page: page,
            last_page: pages,
            per_page: PaginationLength.getOrderTransaction(),
            hasMorePages: pages > parseInt(page, 10),
          },
          transaction_list: docs,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrderRefundData
   * @description  get All Order Refund Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getOrderRefundData(req, res) {
    try {
      const {
        page,
        organization_id,
        order_item_id,
        patient_id,
        from_date,
        to_date,
      } = req.query;
      const condition = [];
      const wherecondition = [];
      if (organization_id !== '') {
        condition.push({
          organization_id,
        });
      }
      if (order_item_id !== '') {
        condition.push({
          order_item_id,
        });
      }
      if (patient_id !== '') {
        condition.push({
          user_id: patient_id,
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
      condition.push({
        type: 3,
      });
      const parametes = {
        page,
        where: condition,
        paginate: PaginationLength.getOrderTransaction(),
        order: [['created_at', 'DESC']],
        attributes: [
          'user_transaction_id',
          'type',
          'user_id',
          'organization_id',
          'transaction_id',
          'order_id',
          'order_item_id',
          'amount',
          'created_at',
          [
            Sequelize.literal(`(
                    SELECT company_name
                    FROM organization_info AS organization_info_table
                    WHERE ( organization_info_table.user_id = UserTransactions.organization_id)
                )`),
            'company_name',
          ],
        ],
        include: [
          {
            model: models.Users,
            as: 'users',
            attributes: ['first_name', 'last_name'],
            required: true,
          },
          {
            model: models.Orders,
            as: 'orders',
            where: wherecondition,
            required: true,
            attributes: [
              'order_id',
              'transaction_id',
              'total_amount',
              'user_id',
              'payout_note',
              'organization_id',
              'packing_shipping_fee',
              'doctor_visit_fee',
              'telemedicine_platform_fee',
              'medication_cost',
              'payout_status',
              'payment_status',
              'order_status',
              'created_at',
            ],
          },
          {
            model: models.OrderItems,
            as: 'order_items',
            attributes: [
              'order_item_id',
              'formulary_id',
              'qty',
              'price',
              'sub_total',
            ],
            include: [
              {
                model: models.Formulary,
                as: 'formulary',
                attributes: ['name', 'formulary_id'],
              },
            ],
          },
        ],
      };
      const countData = await models.UserTransactions.count(parametes);
      const { docs, pages } = await models.UserTransactions.paginate(parametes);
      return response.successResponse(
        req,
        res,
        'admin.get_order_transaction_success',
        {
          pagination: {
            total: countData,
            count: docs.length,
            current_page: page,
            last_page: pages,
            per_page: PaginationLength.getOrderTransaction(),
            hasMorePages: pages > parseInt(page, 10),
          },
          transaction_list: docs,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationRefundData
   * @description  get All Refund Organization Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getOrganizationRefundData(req, res) {
    try {
      const getOrganizationData = await models.UserTransactions.findAll({
        attributes: ['order_id', 'organization_id'],
        group: ['organization_id'],
        where: { type: 3 },
        include: [
          {
            model: models.OrganizationInfo,
            as: 'organization_info',
            attributes: [
              [
                Sequelize.literal(`(
                SELECT organization_info_id
                FROM organization_info AS organization_info_table
                WHERE ( organization_info_table.user_id = UserTransactions.organization_id)
            )`),
                'organization_info_id',
              ],
              [
                Sequelize.literal(`(
                SELECT company_name
                FROM organization_info AS organization_info_table
                WHERE ( organization_info_table.user_id = UserTransactions.organization_id)
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
        'admin.get_organization_success',
        getOrganizationData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientrefundData
   * @description  get All Refund Patient Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getPatientrefundData(req, res) {
    try {
      const getPatientData = await models.UserTransactions.findAll({
        attributes: ['order_id', 'user_id'],
        group: ['user_id'],
        where: { type: 3 },
        include: [
          {
            model: models.Users,
            as: 'users',
            attributes: ['first_name', 'last_name'],
          },
        ],
      });
      return response.successResponse(
        req,
        res,
        'admin.get_patient_success',
        getPatientData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrderItemrefundData
   * @description  get All Refund OrderItem Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getOrderItemRefundData(req, res) {
    try {
      const getOrderItemData = await models.UserTransactions.findAll({
        attributes: ['order_id', 'user_id', 'order_item_id'],
        group: ['order_item_id'],
        where: { type: 3 },
        order: [['created_at', 'DESC']],
        include: [
          {
            model: models.OrderItems,
            as: 'order_items',
            require: true,
            attributes: [
              'order_item_id',
              'formulary_id',
              'qty',
              'price',
              'sub_total',
            ],
            include: [
              {
                model: models.Formulary,
                as: 'formulary',
                attributes: ['name', 'formulary_id'],
              },
            ],
          },
        ],
      });
      return response.successResponse(
        req,
        res,
        'admin.get_patient_success',
        getOrderItemData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name storeOrderTransactionData
   * @description  Store All Order Transaction Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async storeOrderTransactionData(req, res) {
    try {
      const { type, note, user_transaction_id } = req.body;
      const parametes = {
        where: { user_transaction_id: { [Op.in]: user_transaction_id } },
        order: [['order_id', 'DESC']],
        attributes: [
          'user_transaction_id',
          'type',
          'user_id',
          'organization_id',
          'transaction_id',
          'order_id',
          'order_item_id',
          'amount',
          'created_at',
          'refunded_amount',
          [
            Sequelize.literal(`(
            SELECT first_name
            FROM users AS users_table
            WHERE ( users_table.user_id = UserTransactions.organization_id)
        )`),
            'first_name',
          ],

          [
            Sequelize.literal(`(
                      SELECT company_name
                      FROM organization_info AS organization_info_table
                      WHERE ( organization_info_table.user_id = UserTransactions.organization_id)
                  )`),
            'company_name',
          ],
          [
            Sequelize.literal(`(
            SELECT email
            FROM users AS users_table
            WHERE ( users_table.user_id = UserTransactions.organization_id)
        )`),
            'email',
          ],
          [
            Sequelize.literal(
              '(coalesce(sum(amount),0.00) - coalesce(sum(refunded_amount),0.00))'
            ),
            'total_amounts',
          ],
        ],
        raw: true,
        include: [
          {
            model: models.Users,
            as: 'users',
            attributes: ['first_name', 'last_name', 'email'],
            required: true,
          },
          {
            model: models.Orders,
            as: 'orders',
            required: true,
          },
        ],
        group: ['organization_id'],
      };
      const getOrderRefundData = await models.UserTransactions.findAll(
        parametes
      );

      getOrderRefundData.map(async (value) => {
        const payableAmount = `$${parseFloat(
          parseFloat(value.total_amounts) -
            parseFloat(value['orders.telemedicine_platform_fee'] || 0) -
            parseFloat(value['orders.packing_shipping_fee'] || 0)
        ).toFixed(2)}`;
        if (type === 'all') {
          await models.Orders.update(
            {
              payout_status: 1,
              payout_note: note,
            },
            {
              where: {
                organization_id: value.organization_id,
                payout_status: 2,
                order_status: {
                  [Op.in]: [6, 5],
                },
              },
            }
          );
          const isEmailSent = await emailHelper.sendEmail({
            to: value.email,
            template: 'telepath-organization-payout',
            replacements: {
              FIRSTNAME: `${value.first_name}`,
              NOTE: note,
              TOTALAMOUNT: `${payableAmount}`,
            },
          });
          if (!isEmailSent) {
            throw new Error('admin.organization_payout_mail_not_sent');
          }
        }
        if (type === 'individual') {
          const getOrderData = await models.UserTransactions.findAll({
            where: { user_transaction_id: { [Op.in]: user_transaction_id } },
          });
          await models.Orders.update(
            {
              payout_status: 1,
              payout_note: note,
            },
            {
              where: {
                order_id: {
                  [Op.in]: getOrderData.map((v) => v.order_id),
                },
                payout_status: 2,
                order_status: {
                  [Op.in]: [6, 5],
                },
              },
            }
          );
          const isEmailSent = await emailHelper.sendEmail({
            to: value.email,
            template: 'telepath-organization-payout',
            replacements: {
              FIRSTNAME: `${value.first_name}`,
              NOTE: note,
              TOTALAMOUNT: `${payableAmount}`,
            },
          });
          if (!isEmailSent) {
            throw new Error('admin.organization_payout_mail_not_sent');
          }
        }
      });

      return response.successResponse(req, res, 'admin.note_add_success');
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getSubscriptionTransactionData
   * @description  get All Order Transaction Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getSubscriptionTransactionData(req, res) {
    try {
      const {
        page,
        serach_text,
        from_date,
        to_date,
        payment_status,
        subscription_status,
      } = req.query;
      const condition = [];
      const wherecondition = [];
      if (from_date) {
        const start_date_time = `${from_date}T00:00:00.000Z`;
        condition.push({
          created_at: {
            [Op.gte]: start_date_time,
          },
        });
      }
      if (to_date) {
        const end_date_time = `${to_date}T23:59:00.000Z`;
        condition.push({
          created_at: {
            [Op.lte]: end_date_time,
          },
        });
      }
      if (payment_status) {
        condition.push({ payment_status });
      }
      if (subscription_status) {
        condition.push({ subscription_status });
      }
      if (serach_text) {
        wherecondition.push({
          where: Sequelize.where(
            Sequelize.fn(
              'concat',
              Sequelize.col('first_name'),
              ' ',
              Sequelize.col('last_name')
            ),
            {
              [Op.like]: `%${serach_text}%`,
            }
          ),
        });
      }
      const { docs, pages, total } = await models.SubscriptionHistory.paginate({
        where: condition,
        raw: true,
        nest: true,
        order: [['subscription_history_id', 'DESC']],
        include: [
          {
            model: models.Users,
            as: 'users',
            attributes: ['first_name', 'last_name', 'user_id'],
            where: wherecondition,
          },
        ],
        page,
        paginate: PaginationLength.getOrderTransaction(),
      });
      return response.successResponse(
        req,
        res,
        'admin.get_subscription_transaction_success',
        {
          pagination: {
            total,
            count: docs.length,
            current_page: page,
            last_page: pages,
            per_page: PaginationLength.getOrderTransaction(),
            hasMorePages: pages > parseInt(page, 10),
          },
          transaction_list: docs,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new TransactioncController();
