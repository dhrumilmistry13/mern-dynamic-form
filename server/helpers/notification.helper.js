const { default: axios } = require('axios');
const log = require('log-to-file');
const models = require('../models/index');
require('dotenv').config();

const sendNotification = async (notification, fcm_tokens) => {
  const notification_body = {
    notification,
    registration_ids: fcm_tokens,
    data: notification,
  };
  axios('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      // replace authorization key with your key
      Authorization: `key=${'AAAA3Ypum7k:APA91bGRkH5Dbyy3RvDqwWJ3oR4_vJvOJDlc3EANmOdB3U8QCsGpR2WZKd3GVAQA9i6y4fQvYTSg8vMKS5EB2amiIZQ9HuojwIoipdpbgCBEgmChvd05vpIu6OJxlKHRg3MnvnR9xZbl'}`,
      'Content-Type': 'application/json',
    },
    data: notification_body,
  })
    .then(() => {
      log(
        `----notification send success----\n${JSON.stringify(
          notification_body
        )}`,
        'logs/notification-resonse-success.log',
        '\r\n'
      );
    })
    .catch(() => {
      // console.log(error);
      log(
        `----error to send notification----\n`,
        'logs/notification-resonse-success.log',
        '\r\n'
      );
    });
};
const storeNotification = async (title, message, to_user_id) => {
  try {
    const notification = {
      title,
      body: message,
    };
    const user_device = await models.UserToken.findAll({
      where: {
        user_id: to_user_id,
      },
      attributes: ['token'],
    });
    const fcm_tokens = [];
    if (user_device) {
      user_device.forEach((value) => {
        const { token } = value;
        fcm_tokens.push(token);
      });
      sendNotification(notification, fcm_tokens);
    }
  } catch (error) {
    log(
      `----error to send notification----${error}`,
      'logs/message-log.log',
      '\r\n'
    );
  }
};
module.exports = {
  sendNotification,
  storeNotification,
};
