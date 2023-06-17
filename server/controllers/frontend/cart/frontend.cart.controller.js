const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const models = require('../../../models/index');
const response = require('../../../helpers/response.helper');
const { createOneTimePayment } = require('../../../helpers/payment.helper');
const {
  organizationSendEmail,
  sendEmail,
} = require('../../../helpers/email.helper');
const {
  setFormatDateAndTime,
  getSettingvalue,
} = require('../../../helpers/common.helper');

class CartController {
  /**
   * @name getProductDetails
   * @description Get Formulary Data.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getProductDetails(req, res) {
    try {
      const { formulary_id } = req.query;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const getProductData = await models.OrganizationFormulary.findOne({
        where: {
          formulary_id,
          organization_id: organizationData.user_id,
        },
        include: [
          {
            model: models.Formulary,
            as: 'formulary',
            require: true,
            include: [
              {
                model: models.FormularyImage,
                as: 'formulary_image',
                require: true,
              },
            ],
          },
        ],
      });
      const geFormulartQuestionsData = await models.Questions.scope(
        'defaultScope',
        'patientformulryUserQuestionColumns'
      ).findAll({
        order: [['question_id', 'ASC']],
        where: { formulary_id, user_id: organizationData.user_id },
      });
      const getFormularyData = getProductData.dataValues;
      getFormularyData.prescription_product =
        getProductData.prescription_product;
      getFormularyData.top_discount_product =
        getProductData.top_discount_product;
      getFormularyData.popular_product = getProductData.popular_product;
      getFormularyData.formulary =
        getProductData.dataValues.formulary.dataValues;
      getFormularyData.formulary.status = getProductData.formulary.status;
      getFormularyData.is_question = geFormulartQuestionsData.length !== 0;
      getFormularyData.formulary.featured_image =
        await getProductData.formulary.featured_image.then(
          (dataUrl) => dataUrl
        );
      getFormularyData.formulary.formulary_image = [];
      getProductData.formulary.formulary_image.forEach(async (value) => {
        const data = value.dataValues;
        data.image_name = await value.image_name.then((dataUrl) => dataUrl);
        getFormularyData.formulary.formulary_image.push(data);
      });
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.get_formulary_success',
          getProductData
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name StoreAddCartFormularyDetails
   * @description Add In Cart Formulary Details.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async StoreAddCartFormularyDetails(req, res) {
    try {
      const { user_id } = req.payload.user;
      const {
        order_id,
        formulary_id,
        is_new,
        qty,
        price,
        sub_total,
        packing_shipping_fee,
        medication_cost,
      } = req.body;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const telemedicine_platform_fee =
        organizationData.telemedicine_platform_fee ||
        (await getSettingvalue('home_page_general_telemedicine_platform_Fee'));
      const doctor_visit_fee =
        organizationData.doctor_visit_fee ||
        (await getSettingvalue('home_page_general_doctor_visit_fees'));
      const formularyData = {
        organization_id: organizationData.user_id,
        user_id,
        order_id,
        total_amount:
          parseFloat(sub_total) +
          parseFloat(doctor_visit_fee || 0) +
          parseFloat(telemedicine_platform_fee || 0),
        medication_cost,
        packing_shipping_fee: packing_shipping_fee || null,
        doctor_visit_fee: doctor_visit_fee || null,
        telemedicine_platform_fee: telemedicine_platform_fee || null,
        payment_status: 2,
        order_status: 1,
        payout_status: 2,
        order_items: {
          formulary_id,
          user_id,
          organization_id: organizationData.user_id,
          qty,
          price,
          sub_total,
          packing_shipping_fee: packing_shipping_fee || null,
          medication_cost,
        },
        order_status_histories: {
          status: 1,
        },
      };
      const formularyCartData = await models.Orders.findOne({
        where: {
          user_id,
          organization_id: organizationData.user_id,
          payment_status: 2,
        },
      });
      if (!formularyCartData) {
        await models.Orders.create(formularyData, {
          include: [
            {
              model: models.OrderItems,
              as: 'order_items',
            },
            {
              model: models.OrderStatusHistory,
              as: 'order_status_histories',
            },
          ],
        });
      }
      if (formularyCartData) {
        await models.OrderItems.findOne({
          where: {
            formulary_id,
            user_id,
            organization_id: organizationData.user_id,
            order_id: formularyCartData.order_id,
          },
        }).then(async (obj) => {
          if (obj && is_new === 1) {
            await models.OrderItems.update(
              {
                qty: obj.qty + parseInt(qty, 10),
                price,
                sub_total: Number(obj.sub_total) + Number(sub_total),
                packing_shipping_fee: packing_shipping_fee || null,
                medication_cost:
                  Number(obj.medication_cost) + Number(medication_cost),
              },
              {
                where: {
                  formulary_id,
                  user_id,
                  organization_id: organizationData.user_id,
                  order_id: formularyCartData.order_id,
                },
              }
            );
          }
          if (obj && is_new === 2) {
            await models.OrderItems.update(
              {
                qty,
                price,
                sub_total,
                packing_shipping_fee: packing_shipping_fee || null,
                medication_cost,
              },
              {
                where: {
                  formulary_id,
                  user_id,
                  organization_id: organizationData.user_id,
                  order_id: formularyCartData.order_id,
                },
              }
            );
          }
          if (!obj && is_new === 1) {
            await models.OrderItems.create({
              formulary_id,
              user_id,
              organization_id: organizationData.user_id,
              order_id: formularyCartData.order_id,
              qty,
              price,
              sub_total,
              packing_shipping_fee: packing_shipping_fee || null,
              medication_cost,
            });
          }
        });
        const totalAmount = await models.OrderItems.findOne({
          where: {
            order_id: formularyCartData.order_id,
          },
          attributes: [
            [Sequelize.fn('sum', Sequelize.col('sub_total')), 'total_amount'],
            [
              Sequelize.fn('sum', Sequelize.col('medication_cost')),
              'total_medication_cost',
            ],
            [
              Sequelize.fn('sum', Sequelize.col('packing_shipping_fee')),
              'total_packing_shipping_fee',
            ],
          ],
          group: ['order_id'],
          raw: true,
        });

        const amount = parseFloat(
          parseFloat(totalAmount.total_amount) +
            parseFloat(doctor_visit_fee || 0) +
            parseFloat(telemedicine_platform_fee || 0)
        ).toFixed(2);
        await models.Orders.update(
          {
            total_amount: amount,
            medication_cost: totalAmount.total_medication_cost,
            packing_shipping_fee: totalAmount.total_packing_shipping_fee,
            doctor_visit_fee: doctor_visit_fee || null,
            telemedicine_platform_fee: telemedicine_platform_fee || null,
          },
          {
            where: {
              order_id: formularyCartData.order_id,
            },
          }
        );
      }
      return response.successResponse(
        req,
        res,
        'admin.formulary_add_to_cart_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getProductListDetails
   * @description Get Formulary List Data.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getProductListDetails(req, res) {
    try {
      const { user_id } = req.payload.user;
      const { order_id } = req.query;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const getFormularyData = await models.OrderItems.findAll({
        where: {
          order_id,
          user_id,
          organization_id: organizationData.user_id,
        },
        order: [['order_item_id', 'DESC']],
        include: [
          {
            model: models.Formulary,
            as: 'formulary',
          },
        ],
      });
      const dataList = [];
      if (getFormularyData) {
        getFormularyData.map(async (value, index) => {
          const countQuestionData = await models.Questions.scope(
            'defaultScope',
            'patientformulryUserQuestionColumns'
          ).findAll({
            order: [['question_id', 'ASC']],
            where: {
              is_required: 1,
              formulary_id: value.formulary_id,
              user_id: organizationData.user_id,
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
          const data = value.dataValues;
          data.formulary = value.formulary.dataValues;
          data.formulary.status = value.formulary.status;
          data.is_question_fill =
            countUserQuestionData === countQuestionData.length ? 1 : 2;
          data.question_count = countQuestionData.length;
          data.use_question_count = countUserQuestionData;
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
          'admin.get_formulary_details_success',
          dataList
        );
      }, 300);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name storeOrderAddressData
   * @description Store Order Address.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async storeOrderAddressData(req, res) {
    try {
      const { user_id } = req.payload.user;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const {
        order_id,
        order_note,
        first_name,
        last_name,
        email,
        country_id,
        phone,
        address,
        city,
        state_id,
        zipcode,
        is_billing_same,
        b_first_name,
        b_last_name,
        b_email,
        b_country_id,
        b_phone,
        b_address,
        b_city,
        b_state_id,
        b_zipcode,
        card_data,
      } = req.body;
      let getCardData = await models.UserCards.findOne({
        where: { user_id, is_default: 1 },
        order: [['user_card_id', 'ASC']],
      });
      if (!getCardData && Object.keys(card_data).length !== 0) {
        card_data.user_id = user_id;
        card_data.is_default = 1;
        getCardData = await models.UserCards.create(card_data);
      }
      const getOrderData = await models.Orders.findOne({
        where: { order_id },
      });
      if (
        getCardData &&
        getOrderData &&
        parseFloat(getOrderData.total_amount) !== 0
      ) {
        await createOneTimePayment(
          getOrderData.total_amount,
          getCardData.card_id
        )
          .then(async (getTransction) => {
            const transactionData =
              getTransction.data.data.createOneTimePayment;
            let payment_status = 2;
            let order_status = 1;
            let transaction_id = null;
            if (transactionData) {
              transaction_id = transactionData.transaction_id;
              if (['SUCCEEDED', 'SETTLED'].includes(transactionData.status)) {
                payment_status = 1;
                order_status = 2;
              }
            }
            await models.OrderAddress.findOne({
              where: {
                order_id,
                user_id,
                organization_id: organizationData.user_id,
                type: 1,
              },
            }).then(async (obj) => {
              if (obj) {
                obj.update({
                  first_name,
                  last_name,
                  email,
                  country_id,
                  phone,
                  address,
                  city,
                  state_id,
                  zipcode,
                  is_billing_same,
                  type: 1,
                });
                if (obj && obj.is_billing_same === 1 && is_billing_same === 2) {
                  await models.OrderAddress.destroy({
                    order_id,
                    user_id,
                    organization_id: organizationData.user_id,
                    type: 2,
                  });
                }
              } else {
                await models.OrderAddress.create({
                  order_id,
                  user_id,
                  organization_id: organizationData.user_id,
                  first_name,
                  last_name,
                  email,
                  country_id,
                  phone,
                  address,
                  city,
                  state_id,
                  zipcode,
                  is_billing_same,
                  type: 1,
                });
              }
            });
            if (is_billing_same === 2) {
              await models.OrderAddress.findOne({
                where: {
                  order_id,
                  user_id,
                  organization_id: organizationData.user_id,
                  type: 2,
                },
              }).then(async (obj) => {
                if (obj) {
                  obj.update({
                    first_name: b_first_name,
                    last_name: b_last_name,
                    email: b_email,
                    country_id: b_country_id,
                    phone: b_phone,
                    address: b_address,
                    city: b_city,
                    state_id: b_state_id,
                    zipcode: b_zipcode,
                  });
                } else {
                  await models.OrderAddress.create({
                    order_id,
                    user_id,
                    organization_id: organizationData.user_id,
                    first_name: b_first_name,
                    last_name: b_last_name,
                    email: b_email,
                    country_id: b_country_id,
                    phone: b_phone,
                    address: b_address,
                    city: b_city,
                    state_id: b_state_id,
                    zipcode: b_zipcode,
                    is_billing_same: 2,
                    type: 2,
                  });
                }
              });
            }
            getOrderData.order_note = order_note;
            getOrderData.payment_status = payment_status;
            getOrderData.order_status = order_status;
            getOrderData.transaction_id = transaction_id;
            getOrderData.card_id = getCardData.user_card_id;
            await getOrderData.save();
            await models.OrderStatusHistory.findOne({
              where: { order_id, status: order_status },
            }).then(async (objo) => {
              if (!objo) {
                await models.OrderStatusHistory.create({
                  order_id,
                  status: order_status,
                });
              }
            });
            await models.UserTransactions.findOne({
              where: {
                order_id,
                user_id,
                transaction_id,
                user_card_id: getCardData.user_card_id,
                organization_id: organizationData.user_id,
                payment_status,
              },
            }).then(async (objo) => {
              if (!objo) {
                await models.UserTransactions.create({
                  order_id,
                  user_id,
                  transaction_id,
                  amount: getOrderData.total_amount,
                  user_card_id: getCardData.user_card_id,
                  organization_id: organizationData.user_id,
                  payment_status,
                });
              } else {
                objo.update({
                  order_id,
                  user_id,
                  amount: getOrderData.total_amount,
                  transaction_id,
                  user_card_id: getCardData.user_card_id,
                  organization_id: organizationData.user_id,
                  payment_status,
                });
              }
            });
          })
          .catch((error) => {
            throw new Error(error.message);
          });
      } else if (getOrderData && parseFloat(getOrderData.total_amount) === 0) {
        const paymentStatus = 1;
        const orderStatus = 2;
        await models.OrderAddress.findOne({
          where: {
            order_id,
            user_id,
            organization_id: organizationData.user_id,
            type: 1,
          },
        }).then(async (obj) => {
          if (obj) {
            obj.update({
              first_name,
              last_name,
              email,
              country_id,
              phone,
              address,
              city,
              state_id,
              zipcode,
              is_billing_same,
              type: 1,
            });
            if (obj && obj.is_billing_same === 1 && is_billing_same === 2) {
              await models.OrderAddress.destroy({
                order_id,
                user_id,
                organization_id: organizationData.user_id,
                type: 2,
              });
            }
          } else {
            await models.OrderAddress.create({
              order_id,
              user_id,
              organization_id: organizationData.user_id,
              first_name,
              last_name,
              email,
              country_id,
              phone,
              address,
              city,
              state_id,
              zipcode,
              is_billing_same,
              type: 1,
            });
          }
        });
        if (is_billing_same === 2) {
          await models.OrderAddress.findOne({
            where: {
              order_id,
              user_id,
              organization_id: organizationData.user_id,
              type: 2,
            },
          }).then(async (obj) => {
            if (obj) {
              obj.update({
                first_name: b_first_name,
                last_name: b_last_name,
                email: b_email,
                country_id: b_country_id,
                phone: b_phone,
                address: b_address,
                city: b_city,
                state_id: b_state_id,
                zipcode: b_zipcode,
              });
            } else {
              await models.OrderAddress.create({
                order_id,
                user_id,
                organization_id: organizationData.user_id,
                first_name: b_first_name,
                last_name: b_last_name,
                email: b_email,
                country_id: b_country_id,
                phone: b_phone,
                address: b_address,
                city: b_city,
                state_id: b_state_id,
                zipcode: b_zipcode,
                is_billing_same: 2,
                type: 2,
              });
            }
          });
        }
        getOrderData.order_note = order_note;
        getOrderData.payment_status = paymentStatus;
        getOrderData.order_status = orderStatus;
        await getOrderData.save();
        await models.OrderStatusHistory.findOne({
          where: { order_id, status: orderStatus },
        }).then(async (objo) => {
          if (!objo) {
            await models.OrderStatusHistory.create({
              order_id,
              status: orderStatus,
            });
          }
        });
        await models.UserTransactions.findOne({
          where: {
            order_id,
            user_id,
            organization_id: organizationData.user_id,
            payment_status: paymentStatus,
          },
        }).then(async (objo) => {
          if (!objo) {
            await models.UserTransactions.create({
              order_id,
              user_id,
              amount: getOrderData.total_amount,
              organization_id: organizationData.user_id,
              payment_status: paymentStatus,
            });
          } else {
            objo.update({
              order_id,
              user_id,
              amount: getOrderData.total_amount,
              organization_id: organizationData.user_id,
              payment_status: paymentStatus,
            });
          }
        });
      }
      const totalQty = await models.OrderItems.findOne({
        where: {
          order_id,
        },
        attributes: [[Sequelize.fn('sum', Sequelize.col('qty')), 'total_qty']],
        group: ['order_id'],
        raw: true,
      });
      const qty = totalQty.total_qty;
      const organizationProfileData = await models.Users.findOne({
        where: { user_id: organizationData.user_id },
      });
      const patientProfileData = await models.Users.findOne({
        where: {
          user_id,
        },
      });
      const currentdate = new Date();
      const date = setFormatDateAndTime(currentdate);
      const orderItemDetails = await models.OrderItems.findAll({
        where: {
          order_id,
        },
        include: [
          {
            model: models.Formulary,
            as: 'formulary',
          },
        ],
      });
      if (orderItemDetails) {
        orderItemDetails.map(async (value) => {
          if (value.formulary.is_appointment_required === 1) {
            value.appointment_status = 1;
            value.save();
          }
        });
      }
      if (getOrderData && getOrderData.order_status === 2) {
        const isPatientEmailSent = await organizationSendEmail({
          to: email,
          organization_id: organizationData.user_id,
          template: 'telepath-order-confirm',
          replacements: {
            ORDER_ID: `${getOrderData.order_id}`,
            DATE: date,
            QTY: qty,
            TOTAL_AMOUNT: `${getOrderData.total_amount}`,
          },
        });
        if (!isPatientEmailSent) {
          throw new Error('admin.order_place_mail_not_sent');
        }
        const isOrganizationEmailSent = await sendEmail({
          to: organizationProfileData.email,
          template: 'telepath-organization-order-confirm',
          replacements: {
            ORDER_ID: `${getOrderData.order_id}`,
            DATE: date,
            QTY: qty,
            TOTAL_AMOUNT: `${getOrderData.total_amount}`,
            PATIENT_NAME: `${patientProfileData.first_name} ${patientProfileData.last_name}`,
            PATIENT_NUMBER: `${patientProfileData.phone}`,
          },
        });
        if (!isOrganizationEmailSent) {
          throw new Error('admin.organization_order_place_mail_not_sent');
        }
      }
      await models.UserChatRoom.findOne({
        where: { user_id, organization_id: organizationData.user_id },
      }).then(async (objo) => {
        if (!objo) {
          await models.UserChatRoom.create({
            user_id,
            organization_id: organizationData.user_id,
          });
        }
      });
      return response.successResponse(
        req,
        res,
        'admin.formulary_add_address_cart_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrderAddressData
   * @description Get Order Address.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getOrderAddressData(req, res) {
    try {
      const { user_id } = req.payload.user;
      const { subdomain } = req.headers;
      const { order_id } = req.query;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });

      let addressData = {};
      let getShippingAddress = await models.OrderAddress.findOne({
        where: {
          order_id,
          user_id,
          organization_id: organizationData.user_id,
          type: 1,
        },
      });
      const getOrderData = await models.Orders.findOne({
        where: { order_id },
      });
      let old_order_id = order_id;
      if (!getShippingAddress) {
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
          getShippingAddress = await models.OrderAddress.findOne({
            where: {
              order_id: old_order_id,
              user_id,
              organization_id: organizationData.user_id,
              type: 1,
            },
          });
        }
      }
      const getBillingAddress = await models.OrderAddress.findOne({
        where: {
          order_id: old_order_id,
          user_id,
          organization_id: organizationData.user_id,
          type: 2,
        },
      });
      if (getShippingAddress) {
        addressData = getShippingAddress.dataValues;
        addressData.is_billing_same = getShippingAddress.is_billing_same;
        addressData.b_first_name = '';
        addressData.b_last_name = '';
        addressData.b_email = '';
        addressData.b_country_id = '';
        addressData.b_phone = '';
        addressData.b_address = '';
        addressData.b_city = '';
        addressData.b_state_id = '';
        addressData.b_zipcode = '';
      } else {
        addressData.first_name = '';
        addressData.last_name = '';
        addressData.email = '';
        addressData.country_id = '';
        addressData.phone = '';
        addressData.address = '';
        addressData.city = '';
        addressData.state_id = '';
        addressData.zipcode = '';
        addressData.b_first_name = '';
        addressData.b_last_name = '';
        addressData.b_email = '';
        addressData.b_country_id = '';
        addressData.b_phone = '';
        addressData.b_address = '';
        addressData.b_city = '';
        addressData.b_state_id = '';
        addressData.b_zipcode = '';
        addressData.is_billing_same = 1;
      }
      if (getBillingAddress) {
        addressData.b_first_name = getBillingAddress.first_name;
        addressData.b_last_name = getBillingAddress.last_name;
        addressData.b_email = getBillingAddress.email;
        addressData.b_country_id = getBillingAddress.country_id;
        addressData.b_phone = getBillingAddress.phone;
        addressData.b_address = getBillingAddress.address;
        addressData.b_city = getBillingAddress.city;
        addressData.b_state_id = getBillingAddress.state_id;
        addressData.b_zipcode = getBillingAddress.zipcode;
      }
      if (getOrderData) {
        addressData.order_note = getOrderData.order_note;
      } else {
        addressData.order_note = '';
      }
      return response.successResponse(
        req,
        res,
        'admin.formulary_get_address_cart_success',
        addressData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrderData
   * @description  get All Organization Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getOrderData(req, res) {
    try {
      const { user_id } = req.payload.user;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const getOrderData = await models.Orders.findOne({
        where: {
          user_id,
          payment_status: 2,
          organization_id: organizationData.user_id,
        },
        order: [['order_id', 'DESC']],
        include: [
          { model: models.OrderItems, as: 'order_items' },
          { model: models.OrderAddress, as: 'order_addresses' },
        ],
      });
      let getOrderDetails = {
        order_id: '',
        user_id: '',
        organization_id: '',
        transaction_id: '',
        total_amount: '',
        packing_shipping_fee: '',
        doctor_visit_fee: '',
        telemedicine_platform_fee: '',
        medication_cost: '',
        payment_status: '',
        order_status: '',
        payout_status: '',
        payout_note: '',
        document_id: '',
        selfi_image: '',
        card_id: '',
        order_note: '',
        order_items: [],
        order_addresses: [],
      };
      if (getOrderData) {
        getOrderDetails = {
          order_id: getOrderData.order_id,
          user_id: getOrderData.user_id,
          organization_id: getOrderData.organization_id,
          transaction_id: getOrderData.transaction_id,
          total_amount: getOrderData.total_amount,
          packing_shipping_fee: getOrderData.packing_shipping_fee,
          doctor_visit_fee: getOrderData.doctor_visit_fee,
          telemedicine_platform_fee: getOrderData.telemedicine_platform_fee,
          medication_cost: getOrderData.medication_cost,
          payment_status: getOrderData.payment_status,
          order_status: getOrderData.order_status,
          payout_status: getOrderData.payout_status,
          payout_note: getOrderData.payout_note,
          document_id: await getOrderData.document_id.then(
            (dataUrl) => dataUrl
          ),
          selfi_image: await getOrderData.selfi_image.then(
            (dataUrl) => dataUrl
          ),
          card_id: getOrderData.card_id,
          order_note: getOrderData.order_note,
          order_items: getOrderData.order_items,
          order_addresses: getOrderData.order_addresses,
        };
      }
      return response.successResponse(
        req,
        res,
        'admin.get_organization_success',
        getOrderDetails
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name deleteOrderItemData
   * @description Delete Order Item api
   * @param req
   * @param res
   * @returns { Json } success
   */
  async deleteOrderItemData(req, res) {
    try {
      const { order_item_id, order_id, formulary_id } = req.query;
      const { subdomain } = req.headers;
      const { user_id } = req.payload.user;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const telemedicine_platform_fee =
        organizationData.telemedicine_platform_fee ||
        (await getSettingvalue('home_page_general_telemedicine_platform_Fee'));
      const doctor_visit_fee =
        organizationData.doctor_visit_fee ||
        (await getSettingvalue('home_page_general_doctor_visit_fees'));
      await models.OrderItems.destroy({
        where: {
          order_item_id,
          formulary_id,
          user_id,
          order_id,
          organization_id: organizationData.user_id,
        },
      });
      const getFormulartQuestionsData = await models.Questions.scope([
        'defaultScope',
        'patientformulryUserQuestionColumns',
      ]).findAll({
        where: { formulary_id, user_id: organizationData.user_id },
        include: [
          {
            model: models.QuestionOptions,
            as: 'question_options',
          },
        ],
      });
      if (getFormulartQuestionsData) {
        await models.UserQuestionAns.destroy({
          where: {
            question_id: {
              [Op.in]: getFormulartQuestionsData.map((val) => val.question_id),
            },
            user_id,
            order_id,
            organation_id: organizationData.user_id,
          },
        });
        if (getFormulartQuestionsData) {
          getFormulartQuestionsData.map((obj) =>
            obj.question_options.map(async (value) => {
              await models.UserQuestionAnsOption.destroy({
                where: {
                  question_option_id: value.question_option_id,
                  user_id,
                  order_id,
                  organation_id: organizationData.user_id,
                },
              });
            })
          );
        }
      }

      const getFormularyData = await models.OrderItems.findAll({
        where: {
          order_id,
          user_id,
          organization_id: organizationData.user_id,
        },
      });
      if (getFormularyData) {
        const totalAmount = await models.OrderItems.findOne({
          where: {
            order_id,
          },
          attributes: [
            [Sequelize.fn('sum', Sequelize.col('sub_total')), 'total_amount'],
            [
              Sequelize.fn('sum', Sequelize.col('medication_cost')),
              'total_medication_cost',
            ],
            [
              Sequelize.fn('sum', Sequelize.col('packing_shipping_fee')),
              'total_packing_shipping_fee',
            ],
          ],
          group: ['order_id'],
          raw: true,
        });

        if (totalAmount === null) {
          await models.Orders.update(
            {
              total_amount: 0,
              medication_cost: 0,
            },
            {
              where: {
                order_id,
              },
            }
          );
        } else {
          const amount = parseFloat(
            totalAmount.total_amount +
              parseFloat(doctor_visit_fee || 0) +
              parseFloat(telemedicine_platform_fee || null)
          ).toFixed(2);

          await models.Orders.update(
            {
              total_amount: amount,
              medication_cost: totalAmount.total_medication_cost,
              packing_shipping_fee: totalAmount.total_packing_shipping_fee,
              doctor_visit_fee: doctor_visit_fee || null,
              telemedicine_platform_fee: telemedicine_platform_fee || null,
            },
            {
              where: {
                order_id,
              },
            }
          );
        }
      }
      return response.successResponse(
        req,
        res,
        'admin.order_item_delete_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new CartController();
