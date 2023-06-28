import * as Yup from 'yup';

Yup.addMethod(Yup.string, 'contactcheck', function (errorMessage) {
  return this.test(`test-phone`, errorMessage, function (value) {
    // const phoneRegExp = /^\d{7,13}?$/;
    const phoneRegExp = /^\d{10}?$/;
    if (value && value.length > 0) {
      return phoneRegExp.test(value);
    }
    return true;
  });
});
Yup.addMethod(Yup.string, 'otplength', function (errorMessage) {
  return this.test(`otp-length`, errorMessage, function (value) {
    const { path, createError } = this;
    return (value && value.length === 6) || createError({ path, message: errorMessage });
  });
});
Yup.addMethod(Yup.array, 'optionRequired', function (message, mapper = (a) => a.is_new == 2) {
  return this.test('optionRequired', message, function (list) {
    return new Set(list.filter(mapper)).size !== 0;
  });
});
Yup.addMethod(Yup.mixed, 'file_type', function (errorMessage) {
  return this.test(`test-file_type`, errorMessage, function (value) {
    const isValid = ['jpg', 'jpeg', 'png', 'pdf'];
    if (value !== undefined) {
      const url = new URL(value);
      const type = value.split(';')[0].split('/')[1];
      if ((!type && url.protocol === 'https:') || url.protocol === 'http:') {
        return true;
      }
      return value && isValid.includes(type);
    }
    return true;
  });
});
Yup.addMethod(Yup.string, 'maxlengthPriceShippingfee', function (errorMessage) {
  return this.test(`text-maxlength`, errorMessage, function (value) {
    if (value > 999 || value < 0) {
      return false;
    } else {
      return true;
    }
  });
});
Yup.addMethod(Yup.string, 'priceShippingfeeValidation', function (errorMessage) {
  return this.test(`test-priceValidation`, errorMessage, function (value) {
    const priceValidationRegExp = /^\d{1,3}(\.\d{1,8})?$/;
    if (value && value.length > 0) {
      return priceValidationRegExp.test(value);
    }
    return true;
  });
});

Yup.addMethod(Yup.mixed, 'icon_file', function (errorMessage) {
  return this.test(`test-icon_file`, errorMessage, function (value) {
    if (typeof value === 'string') {
      return true;
    }
    const isValid = ['image/png', 'image/vnd.microsoft.icon', 'image/x-icon'];
    if (value !== undefined) {
      return value && isValid.includes(value.type);
    }
  });
});

Yup.addMethod(Yup.string, 'npicheck', function (errorMessage) {
  return this.test(`test-npi`, errorMessage, function (value) {
    var npi = value;
    if (value) {
      var tmp;
      var sum;
      var i;
      var j;
      i = npi.length;
      if (i == 15 && npi.indexOf('80840', 0, 5) == 0) sum = 0;
      else if (i == 10) sum = 24;
      else return false;
      j = 0;
      while (i != 0) {
        tmp = npi.charCodeAt(i - 1) - '0'.charCodeAt(0);
        if (j++ % 2 != 0) {
          if ((tmp <<= 1) > 9) {
            tmp -= 10;
            tmp++;
          }
        }
        sum += tmp;
        i--;
      }
      if (sum % 10 == 0) return true;
      else return false;
    }
    return true;
  });
});
Yup.addMethod(Yup.array, 'unique', function (message, mapper = (a) => a.option_value) {
  return this.test('unique', message, function (list) {
    return list.length === new Set(list.map(mapper)).size;
  });
});
export default Yup;
