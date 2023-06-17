import * as Yup from 'yup';
Yup.addMethod(Yup.string, 'phonecheck', function (errorMessage) {
  return this.test(`test-phone`, errorMessage, function (value) {
    const phoneRegExp = /^\d{10}?$/;
    if (value && value.length > 0) {
      return phoneRegExp.test(value);
    }
    return true;
  });
});
Yup.addMethod(Yup.mixed, 'file_type', function (errorMessage) {
  return this.test(`test-file_type`, errorMessage, function (value) {
    if (typeof value === 'string') {
      return true;
    }
    const isValid = ['image/jpg', 'image/jpeg', 'image/png'];
    if (value !== undefined) {
      return value && isValid.includes(value.type);
    }
  });
});
Yup.addMethod(Yup.mixed, 'multiplefilecheck', function (errorMessage) {
  return this.test(`test-multiplefilecheck`, errorMessage, function (value) {
    const isValid = ['image/jpg', 'image/jpeg', 'image/png'];
    const checkarr = [];
    for (let key in value) {
      if (value[key].image !== undefined && typeof value[key].image === 'string') {
        checkarr.push(true);
      } else {
        checkarr.push(value && isValid.includes(value[key].type));
      }
    }
    if (checkarr.filter((item, i, ar) => ar.indexOf(item) === i).length > 1) {
      return false;
    }
    return true;
  });
});
Yup.addMethod(Yup.string, 'maxlength', function (errorMessage) {
  return this.test(`text-maxlength`, errorMessage, function (value) {
    if (value > 999 || value < 0) {
      return false;
    } else {
      return true;
    }
  });
});
Yup.addMethod(Yup.string, 'priceValidation', function (errorMessage) {
  return this.test(`test-priceValidation`, errorMessage, function (value) {
    const priceValidationRegExp = /^\d{1,3}(\.\d{1,8})?$/;
    if (value && value.length > 0) {
      return priceValidationRegExp.test(value);
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
