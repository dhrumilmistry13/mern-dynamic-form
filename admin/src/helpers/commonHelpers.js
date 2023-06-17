import moment from 'moment';
import CryptoJS from 'crypto-js';
import { encode as base64_encode } from 'base-64';
/**
    This function will call in the page, where it is used, and will return image source, and set preview url
*/
const imagePreviewFromik = (file) => {
  const url =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABmJLR0QA/wD/AP+gvaeTAAAFtklEQVR4nO2bS0wTaxiGn2lLSykorYjcilFAUOGIbhBvC2Vj2BFlRWIUNGriwniBGFe6cOGGhdGoGy8kxKgxMVFj0kRRFDVEgoCXw/GIEVqPCKUtYEtL5yyIHI2CB4bpjGWeXWc68799+k3n75d/QENDQ2P2Ikz1gKZNm0Q5gkhGEJ4UOxzFkR5WF+kBZUMUVzeVlDRFethpV+Bqh2Pm00yDJyUlAAg6HWI4DILwqNjhWBep8aOmAnMqKxF0OhDFtZGsxKgRaFu58luJEbuco0YgKCMxqgRC5CVGnUCIrMSoFAiRkxi1AiEyEqNaIMgvMeoFgrwSZ4VAkE/irBEI8kicVQJh5iXOOoEwsxJnpUCYOYmzViDMjESDHMGU4MnevdJPIoqrp3rIrK7AmeC3r8CZ6ox/7WxPFa0CJaIJlIgmUCKqExj0eHh54ADPSkt5eegQQY9H6UiTojqBf588ibe1lXAggLelhe6LF5WONCmqEjg6NMTAs2foTCb+OHcOgL779xVONTmqEuh3OhHDYcyZmcQtXozOZCLk9RIOBJSONiGqEojwzUIJUUQMhUAQEAzqna6qSmCM1QrASG8vQa8XcXQUQ3w8gl6vcLKJUZVAo82G3mwmODCAr7UVgNiMDIVTTY6qBCIIWHJzAXDduAGAJStLyUS/RF0CgbmFhQD42toAsOTlKRnnl6hOYGJR0XevvwpVK6oTaMnJITY9HYDYtDRMKSkKJ5oc1QkEiF+2DABzZqbCSX6N6gSK4TCe5mYABpqbGenrUzjR5KhOoLelhaDbDYAYCuG6dk3hRJOjOoF99+4BYFu7FgSBf27eJNjfr3CqiVGVwHAgQH9jIwD2qipsa9YQDgTovnxZ4WQToyqBnx0OQoODxC9ditlux15ZiWAw8OnWLYY6O5WO91PUI1AUx3/vUsvKgLG7cEpZGWI4zLva2rHmgspQjUD306d8+fAB04IF2DZsGN+eUVGBKSWFwTdvVHkpq0ag6+pVAFLKyr7rvujj4siuqUHQ6XDW149PcdSCKhptQ52deFtb0VssJG/e/MP+hPx80isq6L50iT+PHcO+YwdiMMjoly+ER0bQGY3ozWaMSUnEZmRgyc7+vrcoI6oQ2FNXB0ByaSn6uDhCPh++jg587e0Mv3tHwOnE73IBMDo8TNepU5OeL8ZmI23rVlK3bJFdpOICfR0d9D96BEDA5eLFzp0Md3WB+ONDocakJHRGI36nE4CEggKsRUWIoRChwUFGensZ6uzE73Ty/uxZ/B8/smjfPlnzKyYwHAjQ19CAs75+fFv/w4cA6IxG4vPySCgowLJkCbHp6cSmpqIzmRBDIf46cYK+hgZ87e2Y7XYytm3DOG/e+Hk8z5/z6vBhPjsc0Scw6HbjvHqV3jt3CPl8AAh6PXNWrGDuqlUk5Odjyc1FFxPz0+MFg4Gco0ex5ObSfeECn27fpvfuXRKLirBkZxOTmMjg69cAxKamyv55IiYwHAzSU1eH6/p1wn7/d/uyqqtJ2rjx/59MEEgrL8daXEzP5cv0PXiA+/Fj3I8f//cWgwH79u0zFX9CIiLQ73TSefz42L8JQcC2bh1Db98ScLmYu2rV1OR9g9luJ/vIERbu2YOnpQV/dzdBjwfT/PnY1q8f7yvKiewCQ14vr6qrCbhcxKank11Tg6+tjf7GRgwJCSw+eFDyGDFW67S/BKnIPpHuOn2agMtFwvLlFJw5g7+nh/fnz4MgkHXoEKbkZLkjyIrsFehuGlt2vGj/fpxXrozddUWRhbt3Y12zRu7hZUd2gTFWK6NDQ7yoqgLG7riZu3aNTXKjANkv4ezq6vF1LnMKC1leW0taebncw0YM2SswfunS8ZVW0YhqujG/K5pAiWgCJaIJlIgmUCKaQIloAiWiCZSIJlAimkCJaAIlogmUiCZQItPuxkz3Ce9oQ6tADQ0NDY1p8y/GcQUNzxJXBQAAAABJRU5ErkJggg==';
  if (typeof file == 'string') {
    const extansion = file.split('.');
    const extansion1 = extansion[extansion.length - 1].split('?');
    if (extansion1[0] !== 'pdf') {
      return file;
    } else {
      return url;
    }
  }
  const extansion = file.name.split('.');
  const imgUrl = URL.createObjectURL(file);
  if (extansion[extansion.length - 1] !== 'pdf') {
    return imgUrl;
  } else {
    return url;
  }
};
const urlToGetExnsion = (url) => {
  if (typeof url == 'string') {
    const extansion = url.split('.');
    const extansion1 = extansion[extansion.length - 1].split('?');
    return extansion1[0];
  }
  return url;
};
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
    This function will return random number 
*/
const randomNumber = (min = 1, max = 1000) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
/**
    This function will return numbers only not and will escape characters from string
*/
const allowNumbersOnly = (e) => {
  let val = e.target.value;
  let input_val = e.currentTarget.value;
  if (isNaN(input_val)) {
    input_val = '';
    return input_val;
  } else {
    input_val = e.currentTarget.value;
    val = input_val;
    return val;
  }
};
/**
    This function will return numbers with decimal values, 
    and will be used for input onChange events
*/
const addDecimalVal = (e) => {
  let input_val = e.currentTarget.value;
  let decimal_pos = input_val.indexOf('.');
  var left_side = input_val.substring(0, decimal_pos);
  var right_side = input_val.substring(decimal_pos);
  let final_val;
  if (input_val !== '') {
    if (isNaN(input_val)) {
      input_val = '';
      return input_val;
    } else {
      final_val = left_side + right_side;
      return final_val;
    }
  }
};
/**
    This function will return numbers with decimal values,
    and will be used for input onBlur events
*/
const addDecimalONBlur = (input_val) => {
  let decimal_pos = input_val.indexOf('.');
  var right_side = input_val.substring(decimal_pos);
  if (decimal_pos < 0 && input_val !== '') {
    return input_val + '.00';
  } else if (right_side.length === 1) {
    return input_val + '00';
  } else {
    return input_val;
  }
};
/**
    This function will return numbers with decimal values by 2,
*/
const currencyFormatFloat = (e) => {
  e.preventDefault();
  let input_val = e.currentTarget.value,
    blur = false,
    fixed = true;
  // don't validate empty input
  if (!input_val) {
    return '';
  }

  if (blur) {
    if (input_val === '' || input_val === 0) {
      return 0;
    }
  }

  if (input_val.length === 1 && isNaN(input_val) == false) {
    return parseInt(input_val);
  }

  input_val = '' + input_val;

  let negative = '';
  if (input_val.substr(0, 1) === '-') {
    negative = '-';
  }
  // check for decimal
  if (input_val.indexOf('.') >= 0) {
    // get position of first decimal
    // this prevents multiple decimals from
    // being entered
    var decimal_pos = input_val.indexOf('.');

    // split number by decimal point
    var left_side = input_val.substring(0, decimal_pos);
    var right_side = input_val.substring(decimal_pos);

    // add commas to left side of number
    left_side = left_side.replace(/\D/g, '');

    if (fixed && right_side.length > 3) {
      right_side = parseFloat(0 + right_side).toFixed(2);
      right_side = right_side.substr(1, right_side.length);
    }

    // validate right side
    right_side = right_side.replace(/\D/g, '');

    // Limit decimal to only 2 digits
    if (right_side.length > 2) {
      right_side = right_side.substring(0, 2);
    }

    if (blur && parseInt(right_side) === 0) {
      right_side = '';
    }

    // join number by .
    // input_val = left_side + "." + right_side;

    if (blur && right_side.length < 1) {
      input_val = left_side;
    } else {
      input_val = left_side + '.' + right_side;
    }
  } else {
    // no decimal entered
    // add commas to number
    // remove all non-digits
    input_val = input_val.replace(/\D/g, '');
  }

  if (input_val.length > 1 && input_val.substr(0, 1) === '0' && input_val.substr(0, 2) !== '0.') {
    input_val = input_val.substr(1, input_val.length);
  } else if (input_val.substr(0, 2) === '0,') {
    input_val = input_val.substr(2, input_val.length);
  }
  return negative + input_val;
};
/**
    This function will return true if all keys values in objects are empty,
    and false if any value exists
*/
const checkAllValueEmptyInObj = (data) => {
  if (data) {
    Object.values(data).every((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      return false;
    });
  }
};
/**
    This function will format a date by date month and year of 4 digits
*/
const dateFormatCommon = () => {
  return 'MM-dd-yyyy';
};
const fileToDataUri = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.readAsDataURL(file);
  });
const s3BucketFileUpload = async (file, type, uploadURL) => {
  let binary = atob(file.split(',')[1]);
  let array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  let blobData = new Blob([new Uint8Array(array)], {
    type: type,
  });
  const result = await fetch(uploadURL, {
    method: 'PUT',
    body: blobData,
  });
  return result;
};
const handelEnterKeyStopPress = (e) => {
  if (e.keyCode === 13 || e.which === 13) {
    e.preventDefault();
    return false;
  }
};
const defaultDateTimeFormate = 'MM-DD-YYYY hh:mm A';
const defaultTimeFormate = 'hh:mm A';
const defaultDateFormate = 'MM-DD-YYYY';
const setFormatDate = (date) => {
  return date && date != '' ? moment(date).format(defaultDateFormate) : null;
};

const setFromatTime = (time) => {
  return time && time !== '' ? moment(time).format(defaultTimeFormate) : null;
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

const defaultTimezone = () => {
  return 'America/Denver';
};
const currencyType = () => {
  return '$';
};
export {
  imagePreviewFromik,
  defaultValue,
  randomNumber,
  allowNumbersOnly,
  addDecimalVal,
  addDecimalONBlur,
  currencyFormatFloat,
  checkAllValueEmptyInObj,
  dateFormatCommon,
  urlToGetExnsion,
  fileToDataUri,
  s3BucketFileUpload,
  handelEnterKeyStopPress,
  setFormatDate,
  setFromatTime,
  setFormatDateAndTime,
  momentTimezoneChange,
  defaultTimezone,
  defaultDateTimeFormate,
  defaultTimeFormate,
  defaultDateFormate,
  encryptValues,
  currencyType,
};
