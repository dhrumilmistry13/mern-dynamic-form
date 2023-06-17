const crypto = require('crypto');

const range = (a, z, d = 1) => {
  a = a.charCodeAt();
  z = z.charCodeAt();
  return [...Array(Math.floor((z - a) / d) + 1)].map((_, i) =>
    String.fromCharCode(a + i * d)
  );
};
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const SSO = (key, uid) => {
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
  return { ssocode, ssouidv };
};
// const UserId = '265134';
const UserId = '268888';
const clinicId = '42610';
const ssocode = 'J7R5MUKRA69C3ESD4EY9RNNML43H7QMS';
const DoseSpotGenerateInfo = SSO(ssocode, UserId);
const url = `http://my.staging.dosespot.com/LoginSingleSignOn.aspx?SingleSignOnClinicId=${clinicId}&SingleSignOnUserId=${UserId}&SingleSignOnPhraseLength=32&SingleSignOnCode=${encodeURIComponent(
  DoseSpotGenerateInfo.ssocode
)}&SingleSignOnUserIdVerify=${encodeURIComponent(
  DoseSpotGenerateInfo.ssouidv
)}&RefillsErrors=1`;

console.log(DoseSpotGenerateInfo, 'DoseSpotGenerateInfo');
console.log(clinicId, url);

const axios = require('axios');

// patient add
const data = JSON.stringify({
  Prefix: 'mr',
  FirstName: 'neel',
  MiddleName: '',
  LastName: 'patel',
  Suffix: '',
  DateOfBirth: '1997-06-15',
  Gender: 1,
  Email: 'neel.patient@yopmail.com',
  Address1: '1755 E Bayshore Rd #19a',
  Address2: '',
  City: 'Redwood City',
  State: 'CA',
  ZipCode: '94063',
  PrimaryPhone: '(650) 365-2472',
  PrimaryPhoneType: 1,
  Active: true,
});

const config = {
  method: 'post',
  url: 'https://my.staging.dosespot.com/webapi/api/patients',
  headers: {
    Authorization:
      'Bearer yXyn1qIxw1-CeoIl9SyVOoN_NBruqre0ydVtEbw-kOVWtHYfN-2M730yD1n2jvoWgbhNPeryrAm2h1_8fKic94MDVGsxfPyIMkp4fQF1o-boBIEqOxqHZzj9VK0OQ6pRIx3tLcT9J3ia1Gu73jZEvacvPZ3nFFTwuunmyJuqPdi54OWfeVwB06xT_90SHaFkHWfnAsqS8OiOYmJyvuG2ITP1f-giFFz3S9icuns6JctqqQvjV3OhUu9cOYrMiHNsD0mGH3vKvNUC9XPIlL73dA',
    'Content-Type': 'application/json',
  },
  data,
};

axios(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
