const cron = require('node-cron');
const { Op } = require('sequelize');
const moment = require('moment');
const models = require('../models/index');
const {
  getSubdcriptionData: getSubscriptionData,
} = require('../helpers/payment.helper');
const {
  GetPrescription,
  GetFillRequest,
} = require('../helpers/transitionrx.helper');
const { translationTextMessage } = require('../helpers/common.helper');
const { storeNotification } = require('../helpers/notification.helper');
const { sendEmail, organizationSendEmail } = require('../helpers/email.helper');
const { momentTimezoneChange } = require('../helpers/common.helper');

/**
 * Configuration of cron jobs
 * Refer https://crontab.guru
 */
const deviceTokenRemove = async () => {
  await models.UserToken.destroy({
    force: true,
    truncate: false,
    where: {
      updated_at: {
        [Op.lt]: moment().subtract(360, 'minutes').toDate(),
      },
    },
  });
};
const orgSubscriptionExpire = async () => {
  const orgData = await models.SubscriptionHistory.findAll({
    where: {
      payment_status: 1,
      subscription_status: { [Op.or]: [2, 4] },
    },
    order: [['renewed_date', 'desc']],
  }).then((obj) => {
    if (obj) {
      return obj.map(async (subscription) => {
        if (
          subscription &&
          moment(subscription.renewed_date).format('YYYY-MM-DD') <=
            moment().format('YYYY-MM-DD')
        ) {
          subscription.update({ subscription_status: 1 });
          await getSubscriptionData(subscription.transaction_id).then(
            async (recurringPayments) => {
              if (recurringPayments.data.data.recurringPayments.items) {
                const payment_data =
                  recurringPayments.data.data.recurringPayments.items[0];
                if (
                  payment_data.next_payment_date !== null &&
                  payment_data.next_payment_date >
                    moment(subscription.renewed_date).format('YYYY-MM-DD')
                ) {
                  await models.SubscriptionHistory.create({
                    user_id: subscription.user_id,
                    card_no: subscription.card_no,
                    card_id: subscription.card_id,
                    payment_status: 1,
                    subscription_status: 4,
                    transaction_id: payment_data.recurring_id,
                    plan_amount: parseFloat(
                      payment_data.total_amount_per_payment / 100
                    ),
                    plan_id: payment_data.payment_interval,
                    start_date: `${payment_data.prev_payment_date} 00:00:00`,
                    renewed_date: `${payment_data.next_payment_date} 00:00:00`,
                  });
                }
              }
            }
          );
        }
        return subscription;
      });
    }
    return obj;
  });
  return orgData;
};
const orgSubscriptionExpireData = async () => {
  const orgData = await models.SubscriptionHistory.findAll({
    where: {
      payment_status: 1,
      subscription_status: 1,
      renewed_date: {
        [Op.gte]: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      },
    },
  }).then((obj) => {
    if (obj) {
      return obj.map(async (subscription) => {
        if (
          subscription &&
          moment(subscription.renewed_date).format('YYYY-MM-DD') <=
            moment().format('YYYY-MM-DD')
        ) {
          const getSubscription = await models.SubscriptionHistory.findOne({
            where: {
              payment_status: 1,
              transaction_id: subscription.transaction_id,
              subscription_status: { [Op.or]: [2, 4] },
            },
          });
          if (getSubscription === null) {
            await getSubscriptionData(subscription.transaction_id).then(
              async (recurringPayments) => {
                if (recurringPayments.data.data.recurringPayments.items) {
                  const payment_data =
                    recurringPayments.data.data.recurringPayments.items[0];
                  if (
                    payment_data.next_payment_date !== null &&
                    payment_data.next_payment_date >
                      moment(subscription.renewed_date).format('YYYY-MM-DD')
                  ) {
                    await models.SubscriptionHistory.create({
                      user_id: subscription.user_id,
                      card_no: subscription.card_no,
                      card_id: subscription.card_id,
                      payment_status: 1,
                      subscription_status: 4,
                      transaction_id: payment_data.recurring_id,
                      plan_amount: parseFloat(
                        payment_data.total_amount_per_payment / 100
                      ),
                      plan_id: payment_data.payment_interval,
                      start_date: `${payment_data.prev_payment_date} 00:00:00`,
                      renewed_date: `${payment_data.next_payment_date} 00:00:00`,
                    });
                  }
                }
              }
            );
          }
        }
        return subscription;
      });
    }
    return obj;
  });
  return orgData;
};
const OrderStatusChange = async (order_id, status) => {
  const getOrderData = await models.Orders.findOne({
    where: { order_id },
  });
  const getOrderAllItems = await models.OrderItems.findAll({
    where: { order_id },
  });
  let is_valid = false;
  const getRxAcceptItems = getOrderAllItems.filter((v) => v.rx_status === 2);
  const rxAcceptCount = getRxAcceptItems.length;
  const rxRejectCount = getOrderAllItems.filter((v) =>
    [3, 4, 5].includes(v.rx_status)
  ).length;
  const getRxPendingItems = getOrderAllItems.filter(
    (v) => v.rx_status === 1
  ).length;
  const pendingPre = getRxAcceptItems.filter(
    (v) => v.pre_status === null
  ).length;
  const getPreShippedItems = getRxAcceptItems.filter(
    (v) => v.pre_status === 4
  ).length;
  const getShippedItems = getRxAcceptItems.filter(
    (v) => v.transitionrx_fill_status === 3
  ).length;
  if (getOrderAllItems.length === 1) {
    is_valid = true;
  } else if (rxAcceptCount >= 1 && getRxPendingItems < 1) {
    if (parseInt(status, 10) === 6) {
      status = 3;
    }
    if (pendingPre >= 1) {
      status = 3;
    }
    if (getPreShippedItems >= 1 && pendingPre < 1 && getShippedItems < 1) {
      status = 4;
    }
    if (getShippedItems >= 1 && getPreShippedItems < 1) {
      status = 5;
    }
    is_valid = true;
  } else if (rxRejectCount >= 1 && getRxPendingItems < 1) {
    status = 6;
    is_valid = true;
  }
  if (is_valid) {
    getOrderData.order_status = status;
    await getOrderData.save();
    await models.OrderStatusHistory.create({
      order_id,
      status,
    });
  }
};
const preStatusChangeSendData = async (
  orderItemData,
  status,
  user_chat_room_id,
  email,
  org_email
) => {
  const msgObj = {
    ORDERID: orderItemData.order_id,
    PRICE: orderItemData.sub_total,
    ITEMNAME: orderItemData.formulary.name,
    STATUS: status,
  };
  const rgxString = new RegExp(Object.keys(msgObj).join('|'), 'gi');
  const message = translationTextMessage(
    'admin.org_pre_status_chat_message_text'
  ).replace(rgxString, (matched) => msgObj[matched]);
  const title = translationTextMessage(
    'admin.org_pre_status_chat_message_title'
  );
  await models.UserChat.create({
    message: message || null,
    type_message: 7,
    user_chat_room_id,
    from_user_id: orderItemData.organization_id,
    is_seen: 1,
    to_user_id: orderItemData.user_id,
  });
  await organizationSendEmail({
    to: email,
    organization_id: orderItemData.organization_id,
    template: 'telepath-prescription-status-change',
    replacements: {
      ORDER_ID: orderItemData.order_id,
      ORDER_ITEM_NAME: orderItemData.formulary.name,
      AMOUNT: orderItemData.sub_total,
      STATUS: status,
    },
  });
  await sendEmail({
    to: org_email,
    template: 'telepath-prescription-status-change',
    replacements: {
      ORDER_ID: orderItemData.order_id,
      ORDER_ITEM_NAME: orderItemData.formulary.name,
      AMOUNT: orderItemData.sub_total,
      STATUS: status,
    },
  });
  await storeNotification(title, message, orderItemData.user_id);
  await storeNotification(title, message, orderItemData.organization_id);
};
const OrderShipperStatusCheck = async () => {
  const pendingOrderItemData = await models.OrderItems.findAll({
    where: {
      rx_status: 2,
      pre_status: {
        [Op.notIn]: [4],
      },
      transitionrx_fill_status: {
        [Op.notIn]: [3],
      },
    },
    include: [
      {
        model: models.Formulary,
        as: 'formulary',
        attributes: ['name', 'formulary_id'],
      },
    ],
  });
  if (pendingOrderItemData) {
    pendingOrderItemData.map(async (val) => {
      const orderItemData = val;
      const getChatUserData = await models.UserChatRoom.findOne({
        attributes: [
          'user_chat_room_id',
          'organization_id',
          'user_id',
          'created_at',
        ],
        where: {
          user_id: orderItemData.user_id,
          organization_id: orderItemData.organization_id,
        },
        order: [['created_at', 'DESC']],
      });
      const userData = await models.Users.findOne({
        where: { user_id: orderItemData.user_id },
      });
      const orgData = await models.Users.findOne({
        where: { user_id: orderItemData.organization_id },
      });
      await GetPrescription(orderItemData.transitionrx_prescription_id).then(
        async (res_pre) => {
          if (
            orderItemData.pre_status !== 1 &&
            res_pre.data.status &&
            res_pre.data.sub_status &&
            res_pre.data.status === 'Pending' &&
            res_pre.data.sub_status === 'Patient Contact'
          ) {
            orderItemData.pre_status = 1;
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              pre_status: 1,
            });
            await preStatusChangeSendData(
              orderItemData,
              `${res_pre.data.status}(${res_pre.data.sub_status})`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
          } else if (
            orderItemData.pre_status !== 2 &&
            res_pre.data.status &&
            res_pre.data.sub_status &&
            res_pre.data.status === 'Pending' &&
            res_pre.data.sub_status === 'Patient Contact - Insurance'
          ) {
            orderItemData.pre_status = 2;
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              pre_status: 2,
            });
            await preStatusChangeSendData(
              orderItemData,
              `${res_pre.data.status}(${res_pre.data.sub_status})`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
          } else if (
            orderItemData.pre_status !== 3 &&
            res_pre.data.status &&
            res_pre.data.sub_status &&
            res_pre.data.status === 'Pending' &&
            res_pre.data.sub_status === 'Patient Contact – Shipping/Payment'
          ) {
            orderItemData.pre_status = 3;
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              pre_status: 3,
            });
            await preStatusChangeSendData(
              orderItemData,
              `${res_pre.data.status}(${res_pre.data.sub_status})`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
          } else if (
            orderItemData.pre_status !== 4 &&
            res_pre.data.status &&
            res_pre.data.sub_status &&
            res_pre.data.status === 'Processed' &&
            res_pre.data.sub_status === 'Shipped'
          ) {
            orderItemData.pre_status = 4;
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              pre_status: 4,
            });
            await preStatusChangeSendData(
              orderItemData,
              `${res_pre.data.status}(${res_pre.data.sub_status})`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
          } else if (
            orderItemData.pre_status !== 5 &&
            res_pre.data.status &&
            res_pre.data.sub_status &&
            res_pre.data.status === 'Shipped' &&
            res_pre.data.sub_status === 'Product Shipped'
          ) {
            orderItemData.pre_status = 5;
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              pre_status: 5,
            });
            await preStatusChangeSendData(
              orderItemData,
              `${res_pre.data.status}(${res_pre.data.sub_status})`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
          } else if (
            orderItemData.pre_status !== 6 &&
            res_pre.data.status &&
            res_pre.data.sub_status &&
            res_pre.data.status === 'Closed' &&
            res_pre.data.sub_status === 'Patient Cancelled'
          ) {
            orderItemData.pre_status = 6;
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              pre_status: 6,
            });
            await preStatusChangeSendData(
              orderItemData,
              `${res_pre.data.status}(${res_pre.data.sub_status})`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
          } else if (
            orderItemData.pre_status !== 7 &&
            res_pre.data.status &&
            res_pre.data.sub_status &&
            res_pre.data.status === 'Closed' &&
            res_pre.data.sub_status === 'Patient No Response'
          ) {
            orderItemData.pre_status = 7;
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              pre_status: 7,
            });
            await preStatusChangeSendData(
              orderItemData,
              `${res_pre.data.status}(${res_pre.data.sub_status})`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
          } else if (
            orderItemData.pre_status !== 8 &&
            res_pre.data.status &&
            res_pre.data.sub_status &&
            res_pre.data.status === 'Closed' &&
            res_pre.data.sub_status === 'Patient Declined Therapy'
          ) {
            orderItemData.pre_status = 8;
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              pre_status: 8,
            });
            await preStatusChangeSendData(
              orderItemData,
              `${res_pre.data.status}(${res_pre.data.sub_status})`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
          } else if (
            orderItemData.pre_status !== 9 &&
            res_pre.data.status &&
            res_pre.data.sub_status &&
            res_pre.data.status === 'Closed' &&
            res_pre.data.sub_status === 'Prescriber No Response'
          ) {
            orderItemData.pre_status = 9;
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              pre_status: 9,
            });
            await preStatusChangeSendData(
              orderItemData,
              `${res_pre.data.status}(${res_pre.data.sub_status})`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
          } else if (
            orderItemData.pre_status !== 10 &&
            res_pre.data.status &&
            res_pre.data.sub_status &&
            res_pre.data.status === 'Closed' &&
            res_pre.data.sub_status === 'Prescriber Cancelled Therapy'
          ) {
            orderItemData.pre_status = 10;
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              pre_status: 10,
            });
            await preStatusChangeSendData(
              orderItemData,
              `${res_pre.data.status}(${res_pre.data.sub_status})`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
          }
          await orderItemData.save();
        }
      );

      return orderItemData;
    });
  }
};
const fillStatusChangeSendData = async (
  orderItemData,
  status,
  user_chat_room_id,
  email,
  org_email
) => {
  const msgObj = {
    ORDERID: orderItemData.order_id,
    PRICE: orderItemData.sub_total,
    ITEMNAME: orderItemData.formulary.name,
    STATUS: status,
  };
  const rgxString = new RegExp(Object.keys(msgObj).join('|'), 'gi');
  const message = translationTextMessage(
    'admin.org_fill_status_chat_message_text'
  ).replace(rgxString, (matched) => msgObj[matched]);
  const title = translationTextMessage(
    'admin.org_fill_status_chat_message_title'
  );
  await models.UserChat.create({
    message: message || null,
    type_message: 8,
    user_chat_room_id,
    from_user_id: orderItemData.organization_id,
    is_seen: 1,
    to_user_id: orderItemData.user_id,
  });
  await organizationSendEmail({
    to: email,
    organization_id: orderItemData.organization_id,
    template: 'telepath-fill-status-change',
    replacements: {
      ORDER_ID: orderItemData.order_id,
      ORDER_ITEM_NAME: orderItemData.formulary.name,
      AMOUNT: orderItemData.sub_total,
      STATUS: status,
    },
  });
  await sendEmail({
    to: org_email,
    template: 'telepath-fill-status-change',
    replacements: {
      ORDER_ID: orderItemData.order_id,
      ORDER_ITEM_NAME: orderItemData.formulary.name,
      AMOUNT: orderItemData.sub_total,
      STATUS: status,
    },
  });
  await storeNotification(title, message, orderItemData.user_id);
};
const orderFillRequestStatusChange = async () => {
  const pendingOrderItemData = await models.OrderItems.findAll({
    where: {
      rx_status: 2,
      transitionrx_fill_status: {
        [Op.notIn]: [3],
      },
    },
    include: [
      {
        model: models.Formulary,
        as: 'formulary',
        attributes: ['name', 'formulary_id'],
      },
    ],
  });
  if (pendingOrderItemData) {
    pendingOrderItemData.map(async (val) => {
      const orderItemData = val;
      const getChatUserData = await models.UserChatRoom.findOne({
        attributes: [
          'user_chat_room_id',
          'organization_id',
          'user_id',
          'created_at',
        ],
        where: {
          user_id: orderItemData.user_id,
          organization_id: orderItemData.organization_id,
        },
        order: [['created_at', 'DESC']],
      });
      const userData = await models.Users.findOne({
        where: { user_id: orderItemData.user_id },
      });
      const orgData = await models.Users.findOne({
        where: { user_id: orderItemData.organization_id },
      });
      await GetFillRequest(orderItemData.transitionrx_fill_id).then(
        async (res) => {
          if (
            res.data.status &&
            res.data.status === 'Placed' &&
            orderItemData.transitionrx_fill_status !== 1
          ) {
            orderItemData.transitionrx_fill_status = 1;
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              transitionrx_fill_status: 1,
            });
            await fillStatusChangeSendData(
              orderItemData,
              `${res.data.status}`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
            OrderStatusChange(orderItemData.order_id, 4);
          } else if (
            res.data.status &&
            res.data.status === 'Replacement' &&
            orderItemData.transitionrx_fill_status !== 2
          ) {
            orderItemData.transitionrx_fill_status = 2;
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              transitionrx_fill_status: 2,
            });
            await fillStatusChangeSendData(
              orderItemData,
              `${res.data.status}`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
          } else if (
            res.data.status &&
            res.data.status === 'Shipped' &&
            orderItemData.transitionrx_fill_status !== 3
          ) {
            orderItemData.transitionrx_fill_status = 3;
            await orderItemData.save();
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              transitionrx_fill_status: 3,
            });
            await fillStatusChangeSendData(
              orderItemData,
              `${res.data.status}`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
            OrderStatusChange(orderItemData.order_id, 5);
          } else if (
            res.data.status &&
            res.data.status === 'Cancelled' &&
            orderItemData.transitionrx_fill_status !== 4
          ) {
            orderItemData.transitionrx_fill_status = 4;
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              transitionrx_fill_status: 4,
            });
            await fillStatusChangeSendData(
              orderItemData,
              `${res.data.status}`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
          } else if (
            orderItemData.transitionrx_fill_status !== 5 &&
            res.data.status &&
            res.data.sub_status &&
            res.data.status === 'Exception' &&
            res.data.sub_status === 'Missing Rx'
          ) {
            orderItemData.transitionrx_fill_status = 5;
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              transitionrx_fill_status: 5,
            });
            await fillStatusChangeSendData(
              orderItemData,
              `${res.data.status}(${res.data.sub_status})`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
          } else if (
            orderItemData.transitionrx_fill_status !== 6 &&
            res.data.status &&
            res.data.sub_status &&
            res.data.status === 'Exception' &&
            res.data.sub_status === 'Expired'
          ) {
            orderItemData.transitionrx_fill_status = 6;
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              transitionrx_fill_status: 6,
            });
            await fillStatusChangeSendData(
              orderItemData,
              `${res.data.status}(${res.data.sub_status})`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
          } else if (
            orderItemData.transitionrx_fill_status !== 7 &&
            res.data.status &&
            res.data.sub_status &&
            res.data.status === 'Exception' &&
            res.data.sub_status === 'Too Soon'
          ) {
            orderItemData.transitionrx_fill_status = 7;
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              transitionrx_fill_status: 7,
            });
            await fillStatusChangeSendData(
              orderItemData,
              `${res.data.status}(${res.data.sub_status})`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
          } else if (
            orderItemData.transitionrx_fill_status !== 8 &&
            res.data.status &&
            res.data.sub_status &&
            res.data.status === 'Exception' &&
            res.data.sub_status === 'DOB'
          ) {
            orderItemData.transitionrx_fill_status = 8;
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              transitionrx_fill_status: 8,
            });
            await fillStatusChangeSendData(
              orderItemData,
              `${res.data.status}(${res.data.sub_status})`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
          } else if (
            orderItemData.transitionrx_fill_status !== 9 &&
            res.data.status &&
            res.data.sub_status &&
            res.data.status === 'Exception' &&
            res.data.sub_status === 'Name'
          ) {
            orderItemData.transitionrx_fill_status = 9;
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              transitionrx_fill_status: 9,
            });
            await fillStatusChangeSendData(
              orderItemData,
              `${res.data.status}(${res.data.sub_status})`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
          } else if (
            orderItemData.transitionrx_fill_status !== 10 &&
            res.data.status &&
            res.data.sub_status &&
            res.data.status === 'Exception' &&
            res.data.sub_status === 'Address'
          ) {
            orderItemData.transitionrx_fill_status = 10;
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              transitionrx_fill_status: 10,
            });
            await fillStatusChangeSendData(
              orderItemData,
              `${res.data.status}(${res.data.sub_status})`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
          } else if (
            orderItemData.transitionrx_fill_status !== 11 &&
            res.data.status &&
            res.data.sub_status &&
            res.data.status === 'Exception' &&
            res.data.sub_status === 'RX Confirmation'
          ) {
            orderItemData.transitionrx_fill_status = 11;
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              transitionrx_fill_status: 11,
            });
            await fillStatusChangeSendData(
              orderItemData,
              `${res.data.status}(${res.data.sub_status})`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
          } else if (
            orderItemData.transitionrx_fill_status !== 12 &&
            res.data.status &&
            res.data.sub_status &&
            res.data.status === 'Exception' &&
            res.data.sub_status === 'Pending'
          ) {
            orderItemData.transitionrx_fill_status = 12;
            models.OrderItemStatusHistory.create({
              order_id: orderItemData.order_id,
              order_item_id: orderItemData.order_item_id,
              transitionrx_fill_status: 12,
            });
            await fillStatusChangeSendData(
              orderItemData,
              `${res.data.status}(${res.data.sub_status})`,
              getChatUserData.user_chat_room_id,
              userData.email,
              orgData.email
            );
          }
          orderItemData.tracking_number = res.data.tracking_number;
          orderItemData.shipped_date = res.data.shipped_date;
          await orderItemData.save();
        }
      );
      return orderItemData;
    });
  }
};

const appointmentReminder = async () => {
  const appointmentData = await models.Bookings.findAll({
    where: {
      booking_status: 2,
    },
  }).then((obj) => {
    if (obj) {
      return obj.map(async (appointment) => {
        if (appointment.book_date !== null && appointment.start_time !== null) {
          const startDate = `${appointment.book_date} ${appointment.start_time}`;
          const startTime = moment(startDate).format('YYYY-MM-DDTHH:mm:00');
          const endTime = moment().format('YYYY-MM-DDTHH:mm:00');
          const duration = moment.duration(moment(startTime).diff(endTime));
          // const hours = duration.asHours();
          const minutes = duration.asMinutes();
          // const numhours = Math.floor((hours % 1440) / 60);
          const organizationProfileData = await models.Users.findOne({
            where: { user_id: appointment.organation_id },
          });
          const getbookingTimezone = await models.Timezones.findOne({
            where: {
              timezone_id: appointment.timezone_id,
            },
            attributes: ['utc', 'text'],
          });
          const getOrgTimezone = await models.Timezones.findOne({
            where: {
              timezone_id: organizationProfileData.timezone_id,
            },
            attributes: ['utc', 'text'],
          });
          const appointmentStartDate = moment(
            momentTimezoneChange(
              getOrgTimezone.utc,
              getbookingTimezone.utc,
              'YYYY-MM-DD HH:mm:ss',
              'DD-MM-YYYY',
              `${appointment.book_date} ${appointment.start_time}`
            ),
            'DD-MM-YYYY hh:mm A'
          );
          const Date = moment(
            appointmentStartDate,
            'DD-MM-YYYY hh:mm A'
          ).format('MM-DD-YYYY');
          const appointmentStartTime = moment(
            momentTimezoneChange(
              getOrgTimezone.utc,
              getbookingTimezone.utc,
              'YYYY-MM-DD HH:mm:ss',
              'DD-MM-YYYY hh:mm A',
              `${appointment.book_date} ${appointment.start_time}`
            ),
            'DD-MM-YYYY hh:mm A'
          );
          const appointmentEndTime = moment(
            momentTimezoneChange(
              getOrgTimezone.utc,
              getbookingTimezone.utc,
              'YYYY-MM-DD HH:mm:ss',
              'DD-MM-YYYY hh:mm A',
              `${appointment.book_date} ${appointment.end_time}`
            ),
            'DD-MM-YYYY hh:mm A'
          );
          let appointmentTime = '';
          if (
            moment(appointmentStartTime, 'DD-MM-YYYY hh:mm A').format(
              'YYYY-MM-DD'
            ) <
            moment(appointmentEndTime, 'DD-MM-YYYY hh:mm A').format(
              'YYYY-MM-DD'
            )
          ) {
            appointmentTime = `${moment(
              appointmentStartTime,
              'DD-MM-YYYY hh:mm A'
            ).format('MM-DD-YYYY hh:mm A')} To ${moment(
              appointmentEndTime,
              'DD-MM-YYYY hh:mm A'
            ).format('MM-DD-YYYY hh:mm A')}`;
          } else {
            appointmentTime = `${moment(
              appointmentStartTime,
              'MM-DD-YYYY hh:mm A'
            ).format('hh:mm A')} To ${moment(
              appointmentEndTime,
              'MM-DD-YYYY hh:mm A'
            ).format('hh:mm A')}`;
          }
          const time = Math.round(minutes);
          if (appointment && time === 60) {
            const bookingData = await models.Bookings.findAll({
              where: {
                booking_status: 2,
                bookings_id: appointment.bookings_id,
              },
            });
            bookingData.forEach(async (value) => {
              const patient_id = value.user_id;
              const org_id = value.organation_id;
              const patientData = await models.Users.findOne({
                where: {
                  user_id: patient_id,
                },
              });
              const organizationUserData = await models.Users.findOne({
                where: {
                  user_id: org_id,
                },
              });
              const organizationData = await models.OrganizationInfo.findOne({
                where: {
                  user_id: org_id,
                },
              });
              await organizationSendEmail({
                to: patientData.email,
                organization_id: org_id,
                template: 'telepath-patient-reminder-appointment',
                replacements: {
                  FIRSTNAME: `${patientData.first_name}`,
                  ORGANIZATIONNAME: `${organizationData.company_name}`,
                  BOOKING_ID: `${value.bookings_id}`,
                  REMINDER: '1 Hours',
                  BOOK_DATE: Date,
                  TIME: appointmentTime,
                  TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
                },
              });

              await sendEmail({
                to: organizationUserData.email,
                template: 'telepath-organization-reminder-appointment',
                replacements: {
                  FIRSTNAME: `${organizationUserData.first_name}`,
                  PATIENTNAME: `${patientData.first_name}`,
                  BOOKING_ID: `${value.bookings_id}`,
                  REMINDER: '1 Hours',
                  BOOK_DATE: Date,
                  TIME: appointmentTime,
                  TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
                },
              });
            });
          }
          if (appointment && time === 30) {
            const bookingData = await models.Bookings.findAll({
              where: {
                booking_status: 2,
                bookings_id: appointment.bookings_id,
              },
            });
            bookingData.forEach(async (value) => {
              const patient_id = value.user_id;
              const org_id = value.organation_id;
              const patientData = await models.Users.findOne({
                where: {
                  user_id: patient_id,
                },
              });
              const organizationUserData = await models.Users.findOne({
                where: {
                  user_id: org_id,
                },
              });
              const organizationData = await models.OrganizationInfo.findOne({
                where: {
                  user_id: org_id,
                },
              });
              await organizationSendEmail({
                to: patientData.email,
                organization_id: org_id,
                template: 'telepath-patient-reminder-appointment',
                replacements: {
                  FIRSTNAME: `${patientData.first_name}`,
                  ORGANIZATIONNAME: `${organizationData.company_name}`,
                  BOOKING_ID: `${value.bookings_id}`,
                  REMINDER: '30 Minutes',
                  BOOK_DATE: Date,
                  TIME: appointmentTime,
                  TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
                },
              });

              await sendEmail({
                to: organizationUserData.email,
                template: 'telepath-organization-reminder-appointment',
                replacements: {
                  FIRSTNAME: `${organizationUserData.first_name}`,
                  PATIENTNAME: `${patientData.first_name}`,
                  BOOKING_ID: `${value.bookings_id}`,
                  REMINDER: '30 Minutes',
                  BOOK_DATE: Date,
                  TIME: appointmentTime,
                  TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
                },
              });
            });
          }
          if (appointment && time === 15) {
            const bookingData = await models.Bookings.findAll({
              where: {
                booking_status: 2,
                bookings_id: appointment.bookings_id,
              },
            });
            bookingData.forEach(async (value) => {
              const patient_id = value.user_id;
              const org_id = value.organation_id;
              const patientData = await models.Users.findOne({
                where: {
                  user_id: patient_id,
                },
              });
              const organizationUserData = await models.Users.findOne({
                where: {
                  user_id: org_id,
                },
              });
              const organizationData = await models.OrganizationInfo.findOne({
                where: {
                  user_id: org_id,
                },
              });
              await organizationSendEmail({
                to: patientData.email,
                organization_id: org_id,
                template: 'telepath-patient-reminder-appointment',
                replacements: {
                  FIRSTNAME: `${patientData.first_name}`,
                  ORGANIZATIONNAME: `${organizationData.company_name}`,
                  BOOKING_ID: `${value.bookings_id}`,
                  REMINDER: '15 Minutes',
                  BOOK_DATE: Date,
                  TIME: appointmentTime,
                  TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
                },
              });
              await sendEmail({
                to: organizationUserData.email,
                template: 'telepath-organization-reminder-appointment',
                replacements: {
                  FIRSTNAME: `${organizationUserData.first_name}`,
                  PATIENTNAME: `${patientData.first_name}`,
                  BOOKING_ID: `${value.bookings_id}`,
                  REMINDER: '15 Minutes',
                  BOOK_DATE: Date,
                  TIME: appointmentTime,
                  TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
                },
              });
            });
          }
        }
      });
    }
    return obj;
  });
  return appointmentData;
};

const appointmentStatusChange = async () => {
  const appointmentData = await models.Bookings.findAll({
    include: [
      {
        model: models.Users,
        as: 'users',
      },
      {
        model: models.Users,
        as: 'origination',
        include: [
          {
            model: models.Timezones,
            as: 'timezones',
            attributes: ['utc'],
          },
        ],
      },
    ],
  }).then((obj) => {
    if (obj) {
      return obj.map(async (appointment) => {
        const timezone = appointment.origination.timezones.utc;

        const currentTime = moment().tz(timezone);
        const endTime = moment(
          `${appointment.book_date} ${appointment.end_time}`
        );
        const organizationProfileData = await models.Users.findOne({
          where: { user_id: appointment.organation_id },
        });
        const getbookingTimezone = await models.Timezones.findOne({
          where: {
            timezone_id: appointment.timezone_id,
          },
          attributes: ['utc', 'text'],
        });
        const getOrgTimezone = await models.Timezones.findOne({
          where: {
            timezone_id: organizationProfileData.timezone_id,
          },
          attributes: ['utc', 'text'],
        });
        const appointmentStartDate = moment(
          momentTimezoneChange(
            getOrgTimezone.utc,
            getbookingTimezone.utc,
            'YYYY-MM-DD HH:mm:ss',
            'DD-MM-YYYY',
            `${appointment.book_date} ${appointment.start_time}`
          ),
          'DD-MM-YYYY hh:mm A'
        );
        const Date = moment(appointmentStartDate, 'DD-MM-YYYY hh:mm A').format(
          'MM-DD-YYYY'
        );
        const appointmentStartTime = moment(
          momentTimezoneChange(
            getOrgTimezone.utc,
            getbookingTimezone.utc,
            'YYYY-MM-DD HH:mm:ss',
            'DD-MM-YYYY hh:mm A',
            `${appointment.book_date} ${appointment.start_time}`
          ),
          'DD-MM-YYYY hh:mm A'
        );
        const appointmentEndTime = moment(
          momentTimezoneChange(
            getOrgTimezone.utc,
            getbookingTimezone.utc,
            'YYYY-MM-DD HH:mm:ss',
            'DD-MM-YYYY hh:mm A',
            `${appointment.book_date} ${appointment.end_time}`
          ),
          'DD-MM-YYYY hh:mm A'
        );
        let appointmentTime = '';
        if (
          moment(appointmentStartTime, 'DD-MM-YYYY hh:mm A').format(
            'YYYY-MM-DD'
          ) <
          moment(appointmentEndTime, 'DD-MM-YYYY hh:mm A').format('YYYY-MM-DD')
        ) {
          appointmentTime = `${moment(
            appointmentStartTime,
            'DD-MM-YYYY hh:mm A'
          ).format('MM-DD-YYYY hh:mm A')} To ${moment(
            appointmentEndTime,
            'DD-MM-YYYY hh:mm A'
          ).format('MM-DD-YYYY hh:mm A')}`;
        } else {
          appointmentTime = `${moment(
            appointmentStartTime,
            'DD-MM-YYYY hh:mm A'
          ).format('hh:mm A')} To ${moment(
            appointmentEndTime,
            'DD-MM-YYYY hh:mm A'
          ).format('hh:mm A')}`;
        }
        if (currentTime.valueOf() > endTime.valueOf()) {
          if (
            appointment.org_join_time &&
            !appointment.patient_join_time &&
            (appointment.booking_status === 2 ||
              appointment.booking_status === 4)
          ) {
            appointment.booking_status = 6;
            await appointment.save();
            if (appointment.order_item_id !== null) {
              await models.OrderItems.update(
                {
                  appointment_status: 1,
                },
                {
                  where: {
                    order_item_id: appointment.order_item_id,
                  },
                }
              );
            }
            const companyData = await models.OrganizationInfo.findOne({
              where: {
                user_id: appointment.origination.user_id,
              },
            });
            await organizationSendEmail({
              to: appointment.users.email,
              organization_id: appointment.organation_id,
              template: 'telepath-patient-appoitment-status-update',
              replacements: {
                FIRSTNAME: `${appointment.users.first_name}`,
                ORGANIZATIONNAME: `${companyData.company_name}`,
                STATUS: 'No Show Patient',
                BOOKING_ID: `${appointment.bookings_id}`,
                BOOK_DATE: Date,
                TIME: appointmentTime,
                TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
              },
            });
            await sendEmail({
              to: appointment.origination.email,
              template: 'telepath-organization-appoitment-status-update',
              replacements: {
                FIRSTNAME: `${appointment.origination.first_name}`,
                PATIENTNAME: `${appointment.users.first_name}`,
                STATUS: 'No Show Patient',
                BOOKING_ID: `${appointment.bookings_id}`,
                BOOK_DATE: Date,
                TIME: appointmentTime,
                TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
              },
            });
          }
          if (
            !appointment.org_join_time &&
            appointment.patient_join_time &&
            (appointment.booking_status === 2 ||
              appointment.booking_status === 4)
          ) {
            appointment.booking_status = 7;
            await appointment.save();
            if (appointment.order_item_id !== null) {
              await models.OrderItems.update(
                {
                  appointment_status: 1,
                },
                {
                  where: {
                    order_item_id: appointment.order_item_id,
                  },
                }
              );
            }
            const companyData = await models.OrganizationInfo.findOne({
              where: {
                user_id: appointment.origination.user_id,
              },
            });
            await organizationSendEmail({
              to: appointment.users.email,
              organization_id: appointment.organation_id,
              template: 'telepath-patient-appoitment-status-update',
              replacements: {
                FIRSTNAME: `${appointment.users.first_name}`,
                ORGANIZATIONNAME: `${companyData.company_name}`,
                STATUS: 'No Show Organization',
                BOOKING_ID: `${appointment.bookings_id}`,
                BOOK_DATE: Date,
                TIME: appointmentTime,
                TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
              },
            });
            await sendEmail({
              to: appointment.origination.email,
              template: 'telepath-organization-appoitment-status-update',
              replacements: {
                FIRSTNAME: `${appointment.origination.first_name}`,
                PATIENTNAME: `${appointment.users.first_name}`,
                STATUS: 'No Show Organization',
                BOOKING_ID: `${appointment.bookings_id}`,
                BOOK_DATE: Date,
                TIME: appointmentTime,
                TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
              },
            });
          }
          if (
            !appointment.org_join_time &&
            !appointment.patient_join_time &&
            (appointment.booking_status === 2 ||
              appointment.booking_status === 4)
          ) {
            appointment.booking_status = 5;
            await appointment.save();
            if (appointment.order_item_id !== null) {
              await models.OrderItems.update(
                {
                  appointment_status: 1,
                },
                {
                  where: {
                    order_item_id: appointment.order_item_id,
                  },
                }
              );
            }
            const companyData = await models.OrganizationInfo.findOne({
              where: {
                user_id: appointment.origination.user_id,
              },
            });
            await organizationSendEmail({
              to: appointment.users.email,
              organization_id: appointment.organation_id,
              template: 'telepath-patient-appoitment-status-update',
              replacements: {
                FIRSTNAME: `${appointment.users.first_name}`,
                ORGANIZATIONNAME: `${companyData.company_name}`,
                STATUS: 'No Show Both',
                BOOKING_ID: `${appointment.bookings_id}`,
                BOOK_DATE: Date,
                TIME: appointmentTime,
                TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
              },
            });
            await sendEmail({
              to: appointment.origination.email,
              template: 'telepath-organization-appoitment-status-update',
              replacements: {
                FIRSTNAME: `${appointment.origination.first_name}`,
                PATIENTNAME: `${appointment.users.first_name}`,
                STATUS: 'No Show Both',
                BOOKING_ID: `${appointment.bookings_id}`,
                BOOK_DATE: Date,
                TIME: appointmentTime,
                TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
              },
            });
          }
          if (
            appointment.org_join_time &&
            appointment.patient_join_time &&
            appointment.booking_status === 2
          ) {
            appointment.booking_status = 4;
            await appointment.save();
            if (appointment.order_item_id !== null) {
              await models.OrderItems.update(
                {
                  appointment_status: 3,
                },
                {
                  where: {
                    order_item_id: appointment.order_item_id,
                  },
                }
              );
            }
            const companyData = await models.OrganizationInfo.findOne({
              where: {
                user_id: appointment.origination.user_id,
              },
            });
            await organizationSendEmail({
              to: appointment.users.email,
              organization_id: appointment.organation_id,
              template: 'telepath-patient-appoitment-status-update',
              replacements: {
                FIRSTNAME: `${appointment.users.first_name}`,
                ORGANIZATIONNAME: `${companyData.company_name}`,
                STATUS: 'Completed',
                BOOKING_ID: `${appointment.bookings_id}`,
                BOOK_DATE: Date,
                TIME: appointmentTime,
                TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
              },
            });
            await sendEmail({
              to: appointment.origination.email,
              template: 'telepath-organization-appoitment-status-update',
              replacements: {
                FIRSTNAME: `${appointment.origination.first_name}`,
                PATIENTNAME: `${appointment.users.first_name}`,
                STATUS: 'Completed',
                BOOKING_ID: `${appointment.bookings_id}`,
                BOOK_DATE: Date,
                TIME: appointmentTime,
                TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
              },
            });
          }
          if (appointment.booking_status === 1) {
            appointment.booking_status = 9;
            await appointment.save();
            if (appointment.order_item_id !== null) {
              await models.OrderItems.update(
                {
                  appointment_status: 1,
                },
                {
                  where: {
                    order_item_id: appointment.order_item_id,
                  },
                }
              );
            }
            const companyData = await models.OrganizationInfo.findOne({
              where: {
                user_id: appointment.origination.user_id,
              },
            });
            await organizationSendEmail({
              to: appointment.users.email,
              organization_id: appointment.organation_id,
              template: 'telepath-patient-appoitment-status-update',
              replacements: {
                FIRSTNAME: `${appointment.users.first_name}`,
                ORGANIZATIONNAME: `${companyData.company_name}`,
                STATUS: 'Cancel by System',
                BOOKING_ID: `${appointment.bookings_id}`,
                BOOK_DATE: Date,
                TIME: appointmentTime,
                TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
              },
            });
            await sendEmail({
              to: appointment.origination.email,
              template: 'telepath-organization-appoitment-status-update',
              replacements: {
                FIRSTNAME: `${appointment.origination.first_name}`,
                PATIENTNAME: `${appointment.users.first_name}`,
                STATUS: 'Cancel by System',
                BOOKING_ID: `${appointment.bookings_id}`,
                BOOK_DATE: Date,
                TIME: appointmentTime,
                TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
              },
            });
          }
        }
      });
    }
    return obj;
  });
  return appointmentData;
};
const run = () => {
  cron.schedule('30 23 * * *', () => {
    orgSubscriptionExpire();
    orgSubscriptionExpireData();
  });
  cron.schedule('* * * * * ', () => {
    OrderShipperStatusCheck();
    orderFillRequestStatusChange();
  });
  cron.schedule('* * * * *', () => {
    deviceTokenRemove();
    appointmentReminder();
    appointmentStatusChange();
  });
};
module.exports = {
  run,
};
