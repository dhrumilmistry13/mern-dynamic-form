const axios = require('axios');
const moment = require('moment');

const baseURL = 'https://api.transitionrx.com';
const client = axios.create({
  timeout: 100000,
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
const LoginAccessToken = () => {
  const data = JSON.stringify({
    email: 'Jeff@jctelemedicine.com',
    password: 'Sanjayandteam99',
  });
  return client.post('/authenticate', data);
};
const CreatePrescription = async (request) => {
  try {
    const data = JSON.stringify({
      FirstName: request.first_name,
      LastName: request.last_name,
      MiddleName: '',
      EmailAddress: request.email,
      DateOfBirth: moment(request.dob).format('MM/DD/YYYY'),
      Gender: request.gender === 1 ? 'M' : 'F',
      Address: request.address,
      Address2: '',
      City: request.city,
      StateCode: request.state,
      ZipCode: request.postcode,
      HomePhone: request.phone,
      Brand: '',
      NDC: request.ndc,
      Quantity: request.qty,
      ThirdPartyID: request.order_item_id,
      pap: true,
      Allergies: request.note,
      Medications: request.medication_name,
      Conditions: request.note,
    });
    const LoginData = await LoginAccessToken();
    return client.post('/prescription', data, {
      headers: {
        Authorization: `Bearer ${LoginData.data.token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};
const GetPrescription = async (id) => {
  try {
    const LoginData = await LoginAccessToken();
    console.log(LoginData);
    return client.get(`/prescriptions/${id}`, {
      headers: {
        Authorization: `Bearer ${LoginData.data.token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // console.log(error);
    throw new Error(error);
  }
};
const CreateFillRequest = async (medications, address, third_party_id) => {
  try {
    const data = JSON.stringify({
      strict: true,
      medications,
      address: {
        FirstName: address.first_name,
        LastName: address.last_name,
        Address: address.address,
        Address2: address.address,
        City: address.city,
        State: address.states.short_code,
        Zip: address.zipcode,
      },
      ship_method: 'usps_first',
      third_party_id,
    });
    const LoginData = await LoginAccessToken();
    return client.post(`/fill`, data, {
      headers: {
        Authorization: `Bearer ${LoginData.data.token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};
const GetFillRequest = async (id) => {
  try {
    const LoginData = await LoginAccessToken();
    return client.get(`/fill/${id}`, {
      headers: {
        Authorization: `Bearer ${LoginData.data.token}`,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};
module.exports = {
  LoginAccessToken,
  CreatePrescription,
  GetPrescription,
  CreateFillRequest,
  GetFillRequest,
};
