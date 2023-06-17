const crypto = require('crypto');
const axios = require('axios');
const { t } = require('i18next');

const qs = require('qs');
const models = require('../models/index');

const baseURL = process.env.DOSESPOT_API_URL;
const client = axios.create({
  timeout: 100000,
  baseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});
const range = (a, z, d = 1) => {
  a = a.charCodeAt();
  z = z.charCodeAt();
  return [...Array(Math.floor((z - a) / d) + 1)].map((_, i) =>
    String.fromCharCode(a + i * d)
  );
};
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const encryptionKey = (
  uid = process.env.DOSESPOT_UID,
  clinicId = process.env.DOSESPOT_CLINICID,
  key = process.env.DOSESPOT_KEY
) => {
  let length = 32;
  const aZ09 = [...range('A', 'Z'), ...range('a', 'z'), ...range('0', '9')];
  let randphrase = '';
  // Generate random phrase
  for (let c = 0; c < length; c += 1) {
    randphrase += aZ09[random(0, aZ09.length - 1)];
  }
  const randkey = randphrase + key;
  const toencode = unescape(encodeURIComponent(randkey));
  // const output = CryptoJS.SHA512(toencode).toString(CryptoJS.enc.Hex);
  const output = crypto.createHash('sha512').update(toencode).digest('binary');
  const sso = btoa(output);
  length = sso.length;
  const characters = -2;
  const last2 = sso.slice(characters);
  let ssocode = sso;
  if (last2 === '==') {
    ssocode = sso.slice(0, -2);
  }
  ssocode = randphrase + ssocode;

  const shortphrase = randphrase.slice(0, 22);
  const uidv = uid + shortphrase + key;
  const idencode = unescape(encodeURIComponent(uidv));
  // const idoutput = CryptoJS.SHA512(idencode).toString(CryptoJS.enc.Hex);
  const idoutput = crypto
    .createHash('sha512')
    .update(idencode)
    .digest('binary');
  const idssoe = btoa(idoutput);
  const idcharacters = -2;
  const idlast2 = idssoe.slice(idcharacters);
  let ssouidv = idssoe;
  if (idlast2 === '==') {
    ssouidv = idssoe.slice(0, -2);
  }
  // const url = `http://my.staging.dosespot.com/LoginSingleSignOn.aspx?SingleSignOnClinicId=${clinicId}&SingleSignOnUserId=${uid}&SingleSignOnPhraseLength=32&SingleSignOnCode=${encodeURIComponent(
  //   ssocode
  // )}&SingleSignOnUserIdVerify=${encodeURIComponent(ssouidv)}&RefillsErrors=1`;
  const url = `${
    process.env.DOSESPOT_PATIENT_URL
  }?SingleSignOnClinicId=${clinicId}&SingleSignOnUserId=${uid}&PatientId={{PATIENTID}}&OnBehalfOfUserId=${uid}&SingleSignOnPhraseLength=32&SingleSignOnCode=${encodeURIComponent(
    ssocode
  )}&SingleSignOnUserIdVerify=${encodeURIComponent(ssouidv)}`;
  return { ssocode, ssouidv, uid, clinicId, url };
};
const LoginAccessToken = async (uid = process.env.DOSESPOT_UID) => {
  const loginDetail = encryptionKey(uid);
  const data = qs.stringify({
    grant_type: 'password',
    Username: loginDetail.uid,
    Password: loginDetail.ssouidv,
  });
  const LoginData = await client.post('/token', data, {
    auth: {
      username: loginDetail.clinicId,
      password: loginDetail.ssocode,
    },
  });
  return LoginData;
};
const CliniciansStoreData = async (values) => {
  const data = qs.stringify({
    FirstName: values.first_name.toString(),
    LastName: values.last_name.toString(),
    DateOfBirth: values.dob.toString(),
    Email: values.email.toString(),
    Address1: values.address.slice(0, 34).toString(),
    City: values.city.toString(),
    State: values.state.toString(),
    ZipCode: values.postcode.toString(),
    PrimaryPhone: values.phone.toString(),
    PrimaryPhoneType: '1',
    PrimaryFax: values.phone.toString(),
    NPINumber: values.npi_number.toString(),
    ClinicianRoleType: '1',
    Active: 'True',
  });
  const LoginData = await LoginAccessToken();
  return client.post('/api/clinicians', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${LoginData.data.access_token}`,
    },
  });
};
const CliniciansUpdateData = async (values, id) => {
  const data = qs.stringify({
    FirstName: values.first_name.toString(),
    LastName: values.last_name.toString(),
    DateOfBirth: values.dob.toString(),
    Email: values.email.toString(),
    Address1: values.address.slice(0, 34).toString(),
    City: values.city.toString(),
    State: values.state.toString(),
    ZipCode: values.postcode.toString(),
    PrimaryPhone: values.phone.toString(),
    PrimaryPhoneType: '1',
    PrimaryFax: values.phone.toString(),
    NPINumber: values.npi_number.toString(),
    ClinicianRoleType: '1',
    Active: values.status === 1 ? 'True' : 'False',
  });
  const LoginData = await LoginAccessToken();
  return client.post(`/api/clinicians/${id}`, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${LoginData.data.access_token}`,
    },
  });
};
const organizationDataSync = async (user_id) => {
  const organizationData = await models.Users.findOne({
    where: {
      user_id,
    },
    include: [
      {
        model: models.OrganizationInfo,
        as: 'organization_info',
      },
    ],
  });
  if (organizationData) {
    const stateData = await models.States.findOne({
      where: { state_id: organizationData.organization_info.state },
    });
    const data = {
      first_name: organizationData.first_name,
      last_name: organizationData.last_name,
      dob: organizationData.dob,
      phone: organizationData.phone,
      email: organizationData.email,
      address: organizationData.organization_info.address,
      city: organizationData.organization_info.city,
      state: stateData ? stateData.name : '',
      postcode: organizationData.organization_info.postcode,
      npi_number: organizationData.organization_info.npi_number,
      status:
        organizationData.user_status === 1 ? organizationData.admin_status : 2,
    };
    const blankDataKey = Object.keys(data).filter((k) => {
      if (data[k] === '' || data[k] === undefined || data[k] === null) {
        return k;
      }
      return '';
    });
    if (blankDataKey.length !== 0) {
      throw new Error(
        t('admin.organization_dosespot_data_not_fill').replace(
          '{{FIELDS}}',
          blankDataKey.join(' ').replace('_', ' ')
        )
      );
    } else if (organizationData.organization_info.dosespot_org_id) {
      await CliniciansUpdateData(
        data,
        organizationData.organization_info.dosespot_org_id
      )
        .then(async (obj) => {
          if (obj.data.Result.ResultCode === 'ERROR') {
            throw new Error(obj.data.Result.ResultDescription);
          } else {
            await models.OrganizationInfo.update(
              {
                dosespot_org_id: obj.data.Id,
              },
              {
                where: {
                  user_id,
                },
              }
            );
          }
        })
        .catch((error) => {
          if (error.response && error.response.data)
            throw new Error(
              Object.values(error.response.data.ModelState)[0][0] ||
                error.message
            );
          else throw new Error(error);
        });
    } else {
      await CliniciansStoreData(data)
        .then(async (obj) => {
          if (obj.data.Result.ResultCode === 'ERROR') {
            throw new Error(obj.data.Result.ResultDescription);
          } else {
            await models.OrganizationInfo.update(
              {
                dosespot_org_id: obj.data.Id,
              },
              {
                where: {
                  user_id,
                },
              }
            );
          }
        })
        .catch((err) => {
          if (err.response && err.response.data)
            throw new Error(
              Object.values(err.response.data.ModelState)[0][0] || err.message
            );
          else throw new Error(err);
        });
    }
  } else {
    throw new Error('admin.organization_dosespot_data_not_found');
  }
};
const PatientStoreData = async (
  values,
  dosespot_org_id = process.env.DOSESPOT_UID
) => {
  const data = qs.stringify({
    FirstName: values.first_name.toString(),
    LastName: values.last_name.toString(),
    DateOfBirth: values.dob.toString(),
    Email: values.email.toString(),
    Address1: values.address.slice(0, 34).toString(),
    City: values.city.toString(),
    State: values.state.toString(),
    ZipCode: values.postcode.toString(),
    PrimaryPhone: values.phone.toString(),
    Gender: values.gender.toString(),
    PrimaryPhoneType: '1',
    Active: 'True',
  });
  const LoginData = await LoginAccessToken(dosespot_org_id);
  return client.post('/api/patients', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${LoginData.data.access_token}`,
    },
  });
};
const PatientUpdateData = async (
  values,
  id,
  dosespot_org_id = process.env.DOSESPOT_UID
) => {
  const data = qs.stringify({
    FirstName: values.first_name.toString(),
    LastName: values.last_name.toString(),
    DateOfBirth: values.dob.toString(),
    Email: values.email.toString(),
    Address1: values.address.slice(0, 34).toString(),
    City: values.city.toString(),
    State: values.state.toString(),
    ZipCode: values.postcode.toString(),
    PrimaryPhone: values.phone.toString(),
    Gender: values.gender.toString(),
    PrimaryPhoneType: '1',
    Active: values.status === 1 ? 'True' : 'False',
  });
  const LoginData = await LoginAccessToken(dosespot_org_id);
  return client.post(`/api/patients/${id}`, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${LoginData.data.access_token}`,
    },
  });
};
const PatientDataSync = async (
  user_id,
  dosespot_org_id = process.env.DOSESPOT_UID
) => {
  const patientData = await models.Users.findOne({
    where: {
      user_id,
    },
    include: [
      {
        model: models.PatientInfo,
        as: 'patient_info',
      },
    ],
  });
  if (patientData) {
    const stateData = await models.States.findOne({
      where: { state_id: patientData.patient_info.state },
    });
    const data = {
      first_name: patientData.first_name,
      last_name: patientData.last_name,
      dob: patientData.dob,
      phone: patientData.phone,
      email: patientData.email,
      address: patientData.patient_info.address,
      city: patientData.patient_info.city,
      state: stateData ? stateData.name : '',
      postcode: patientData.patient_info.postcode,
      gender: patientData.patient_info.gender,
      status: patientData.user_status === 1 ? patientData.admin_status : 2,
    };
    const blankDataKey = Object.keys(data).filter((k) => {
      if (data[k] === '' || data[k] === undefined || data[k] === null) {
        return k;
      }
      return '';
    });
    if (blankDataKey.length !== 0) {
      throw new Error(
        t('admin.patient_dosespot_data_not_fill').replace(
          '{{FIELDS}}',
          blankDataKey.join(' ').replace('_', ' ')
        )
      );
    } else if (patientData.patient_info.dosespot_patient_id !== null) {
      await PatientUpdateData(
        data,
        patientData.patient_info.dosespot_patient_id,
        dosespot_org_id
      )
        .then(async (obj) => {
          if (obj.data.Result.ResultCode === 'ERROR') {
            throw new Error(obj.data.Result.ResultDescription);
          } else {
            await models.PatientInfo.update(
              {
                dosespot_patient_id: obj.data.Id,
              },
              {
                where: {
                  user_id,
                },
              }
            );
          }
        })
        .catch((error) => {
          if (error.response && error.response.data)
            throw new Error(
              Object.values(error.response.data.ModelState)[0][0] ||
                error.message
            );
          else throw new Error(error);
        });
    } else {
      await PatientStoreData(data, dosespot_org_id)
        .then(async (obj) => {
          if (obj.data.Result.ResultCode === 'ERROR') {
            throw new Error(obj.data.Result.ResultDescription);
          } else {
            await models.PatientInfo.update(
              {
                dosespot_patient_id: obj.data.Id,
              },
              {
                where: {
                  user_id,
                },
              }
            );
          }
        })
        .catch((err) => {
          if (err.response && err.response.data)
            throw new Error(
              Object.values(err.response.data.ModelState)[0][0] || err.message
            );
          else throw new Error(err);
        });
    }
  } else {
    throw new Error('admin.patient_dosespot_data_not_found');
  }
};
module.exports = {
  encryptionKey,
  LoginAccessToken,
  CliniciansStoreData,
  CliniciansUpdateData,
  organizationDataSync,
  PatientStoreData,
  PatientUpdateData,
  PatientDataSync,
};
