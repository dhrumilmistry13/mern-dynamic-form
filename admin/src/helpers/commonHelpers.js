import moment from 'moment';
import CryptoJS from 'crypto-js';
import { encode as base64_encode } from 'base-64';

/**
    This function will call on select when user select options in corresponding file
*/

const defaultValue = (option, value) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return option ? option.find((option) => option.value === value) : '';
  } else {
    return option
      ? option.filter((option) => {
          return value.includes(option.value.toString());
        })
      : '';
  }
};

/**
    This function will format a date by date month and year of 4 digits
*/
const dateFormatCommon = () => {
  return 'MM-dd-yyyy';
};

const defaultDateTimeFormate = 'MM-DD-YYYY hh:mm A';
const defaultTimeFormate = 'hh:mm A';
const defaultDateFormate = 'MM-DD-YYYY';
const setFormatDate = (date) => {
  return date && date != '' ? moment(date).format(defaultDateFormate) : null;
};

const setFormatDateAndTime = (dateTime) => {
  return dateTime && dateTime !== '' ? moment(dateTime).format(defaultDateTimeFormate) : null;
};
const momentTimezoneChange = (fromTimezone, toTimezone, fromTimeFormat, toTimeFormat, datetime) => {
  moment.tz.setDefault(fromTimezone);
  const format = 'YYYY-MM-DD HH:mm:ss';
  const a = moment(datetime, fromTimeFormat);
  const abc = moment(a).tz(toTimezone).format(format);
  return moment(abc).format(toTimeFormat);
};
const encryptValues = (text) => {
  var data = [{ text }];
  const cipherText = CryptoJS.AES.encrypt(JSON.stringify(data), '12345678901234561234567890123456');
  return base64_encode(cipherText.toString());
};

export {
  defaultValue,
  dateFormatCommon,
  setFormatDate,
  setFormatDateAndTime,
  momentTimezoneChange,
  defaultDateTimeFormate,
  defaultTimeFormate,
  defaultDateFormate,
  encryptValues,
};
