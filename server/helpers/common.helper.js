const { Op } = require('sequelize');
const i18next = require('i18next');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const moment_timezone = require('moment-timezone');
const base64 = require('base-64');
const models = require('../models/index');
const jwt = require('../middleware/jwt.helper');

// const algorithm = 'aes-256-cbc';
// const keyy = crypto.randomBytes(32);
// const iv = crypto.randomBytes(16);

// Get Setting Value
const getSettingvalue = async (key) => {
  const settingdataget = await models.Settings.findOne({
    where: { text_key: key },
  });
  if (settingdataget) {
    return settingdataget.text_value;
  }
  return '';
};
const getOrgSettingvalue = async (key, user_id) => {
  const settingdataget = await models.OrganizationSetting.findOne({
    where: { text_key: key, user_id },
  });
  if (settingdataget) {
    return settingdataget.text_value;
  }
  return '';
};

/**
 *
 * @param Optional
 * @returns Unique no
 * This function is used for generate unique Id
 */

const generateUniqueId = (length = 13, uniqueCharType = 'BOTH') => {
  let result = '';

  let characters = '0123456789';

  if (uniqueCharType !== 'NUMBER_ONLY') {
    characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  }

  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 *
 * @param data objet
 * @returns object
 * Remove Null Data From Json Obj and set ''
 */
const removeNullDataInResponse = (userData) => {
  userData = JSON.stringify(userData, (key, value) =>
    value === null ? '' : value
  );
  return JSON.parse(userData);
};
const getUserDataById = async (user_id) => {
  const getUserData = await models.Users.findOne({
    where: {
      user_id,
    },
  });
  let userData = {};
  if (getUserData) {
    userData = {
      profile_image: await getUserData.profile_image.then((dataUrl) => dataUrl),
      is_email_verified: getUserData.is_email_verified,
      admin_status: getUserData.admin_status,
      user_status: getUserData.user_status,
      profile_setup: getUserData.profile_setup,
      user_id: getUserData.user_id,
      first_name: getUserData.first_name,
      last_name: getUserData.last_name,
      email: getUserData.email,
      country_id: getUserData.country_id,
      phone: getUserData.phone,
      dob: getUserData.dob,
      organation_id: getUserData.organation_id,
      facebook_id: getUserData.facebook_id,
      gmail_id: getUserData.gmail_id,
      timezone_id: getUserData.timezone_id,
    };
  }

  return userData;
};

/**
 *
 * @param keyword: name of key which we want to get
 * @returns Translation from lang folder file message
 * This function is being used to get message from translation file
 */
const translationTextMessage = (keyword) => {
  const text = i18next.t(keyword) ? i18next.t(keyword) : keyword;
  return text;
};

const getTranslationData = async (group = 'backend') => {
  let groupKey = 'admin';
  if (group === 'frontend') {
    groupKey = 'front';
  } else if (group === 'admin') {
    groupKey = 'page';
  } else if (group === 'backend') {
    groupKey = 'admin';
  } else if (group === 'patient') {
    groupKey = 'patient';
  }
  const translationTextData = await models.Translations.findAll({
    attribute: ['key', 'text'],
    where: {
      group: {
        [Op.like]: `%${groupKey}%`,
      },
    },
  });
  const data = {};
  let filename = '';
  let filename1 = '';
  let folderPath = '';
  let folderPath1 = '';

  translationTextData.forEach((value) => {
    data[`${value.group}.${value.key}`] = value.text;
  });
  if (group === 'admin') {
    folderPath = `${path.resolve('../admin/public')}/locales/en`;
    folderPath1 = `${path.resolve('../admin/build')}/locales/en`;
    filename = `${folderPath}/translation.json`;
    filename1 = `${folderPath1}/translation.json`;
  } else if (group === 'frontend') {
    folderPath = `${path.resolve('../front/public')}/locales/en`;
    folderPath1 = `${path.resolve('../front/build')}/locales/en`;
    filename = `${folderPath}/translation.json`;
    filename1 = `${folderPath1}/translation.json`;
  } else if (group === 'patient') {
    folderPath = `${path.resolve('../patient/public')}/locales/en`;
    folderPath1 = `${path.resolve('../patient/build')}/locales/en`;
    filename = `${folderPath}/translation.json`;
    filename1 = `${folderPath1}/translation.json`;
  } else {
    filename = `lang/en/backend.json`;
  }
  if (folderPath !== '' && !fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  fs.writeFile(filename, JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log('Done writing');
  });
  if (filename1 !== '') {
    if (!fs.existsSync(folderPath1)) {
      fs.mkdirSync(folderPath1, { recursive: true });
    }
    fs.writeFile(filename1, JSON.stringify(data), (err) => {
      if (err) throw err;
      console.log('Done writing');
    });
  }
};

// Generate access token and store in user details.
const generateAccessToken = async (user) => {
  const payload = jwt.generateUserTokenPayload(user);
  const accessToken = await jwt.accessToken(payload);
  const isSaved = true;
  return { isSaved, accessToken };
};
function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = crypto.HmacSHA256(dateStamp, `AWS4${key}`);
  const kRegion = crypto.HmacSHA256(regionName, kDate);
  const kService = crypto.HmacSHA256(serviceName, kRegion);
  const kSigning = crypto.HmacSHA256('aws4_request', kService);
  return kSigning;
}
const spliceIntoChunks = (arr, chunkSize) => {
  const res = [];
  while (arr.length > 0) {
    const chunk = arr.splice(0, chunkSize);
    res.push(chunk);
  }
  return res;
};
const momentTimezoneChange = (
  fromTimezone,
  toTimezone,
  fromTimeFormat,
  toTimeFormat,
  datetime
) => {
  moment.tz.setDefault(fromTimezone);
  const format = 'YYYY-MM-DD HH:mm:ss';
  const a = moment(datetime, fromTimeFormat);
  const abc = moment_timezone.tz(a, toTimezone).format(format);
  return moment(abc).format(toTimeFormat);
};
const generateUUID = () => crypto.randomUUID();

const defaultDateTimeFormate = 'MM-DD-YYYY hh:mm A';
const defaultTimeFormate = 'hh:mm A';
const defaultDateFormate = 'MM-DD-YYYY';

const setFormatDate = (date) =>
  date && date !== '' ? moment(date).format(defaultDateFormate) : null;

const setFormatTime = (time, format = 'HH:mm:ss') =>
  time && time !== '' ? moment(time, format).format(defaultTimeFormate) : null;

const setFormatDateAndTime = (dateTime) =>
  dateTime && dateTime !== ''
    ? moment(dateTime).format(defaultDateTimeFormate)
    : null;

const encryptValues = (text) => {
  const data = [{ text }];
  const cipherText = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    '12345678901234561234567890123456'
  );
  return base64.encode(cipherText.toString());
};
module.exports = {
  generateUniqueId,
  removeNullDataInResponse,
  getUserDataById,
  translationTextMessage,
  getTranslationData,
  generateAccessToken,
  getSettingvalue,
  getSignatureKey,
  spliceIntoChunks,
  getOrgSettingvalue,
  generateUUID,
  momentTimezoneChange,
  setFormatDate,
  setFormatTime,
  setFormatDateAndTime,
  defaultDateTimeFormate,
  defaultTimeFormate,
  defaultDateFormate,
  encryptValues,
};
