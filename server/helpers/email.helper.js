const nodemailer = require('nodemailer');
const models = require('../models/index');
const { getSettingvalue } = require('./common.helper');

const transporter = nodemailer.createTransport({
  service: process.env.EMAILSERVICE,
  port: 587,
  secure: true,
  auth: {
    user: process.env.EMAILUSER,
    pass: process.env.EMAILPASSWORD,
  },
});

const sendEmail = async (emailOptions) => {
  let emailSent = false;
  if (!emailOptions.template && !emailOptions.html) {
    throw new Error('Please provide template or html content.');
  }

  const copyrightText = await getSettingvalue(
    'home_page_get_in_touch_footer_copyright'
  );
  const logo = await getSettingvalue('home_page_general_email_logo');

  /** ************** Retrive Email Template ****************** */
  const emailTemplate = await models.EmailTemplate.findOne({
    where: { email_template_key: emailOptions.template },
  });
  let htmlContent = emailTemplate.content;

  /** ************** Replace Dynamic Shortcodes in Email Content ****************** */

  const replacement = new RegExp(
    `{{${Object.keys(emailOptions.replacements).join('}}|{{')}}}`,
    'gi'
  );
  htmlContent = htmlContent.replace(
    replacement,
    (matched) =>
      emailOptions.replacements[matched.replace('{{', '').replace('}}', '')]
  );
  const emailConfig = {
    to: emailOptions.to,
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
    subject: `${emailTemplate.subject}`,
    html: `<html>

    <head></head>
    
    <body>
        <table width='100%' border='0' cellpadding='0' cellspacing='0' style='border-collapse: collapse ; margin: 0px ; padding: 0px ; table-layout: fixed ; width: 100% ; height: 90px;width: 640px ; margin: 0px auto ;'>
            <tbody>
                <tr>
                    <td align=' center' style='width: 640px ; margin: 0px auto ; background-color: #ECECEC ; background-size: cover;padding: 24px 0 38px; text-align:center' valign='top'>
                        <a href='#'>
                            <img alt='Telepath' style="width: auto; height: 90px;" src="${logo}">
    
                        </a>
                    </td>
                </tr>
                <tr>
                    <td>
                        <br>
                        <p>${htmlContent}</p>
                        <strong>Thanks,</strong>
                        <br>
                        <strong>Telepath</strong>
                        <br>
                        <br>
                    </td>
                </tr>
                <tr style='background-color: #484848;'>
                    <td class='content-block' style='text-align: center;width: 100%;padding-top: 20px;'>
    
                    </td>
                </tr>
                <tr style='background-color: #484848; '>
                    <td style='color: #fff; font-weight: 400; font-size: 16px; line-height: 15px; padding: 20px 0px;' align='center'>${copyrightText}</td>
                </tr>
            </tbody>
        </table>
    </body>
    
    </html>`,
  };

  await transporter
    .sendMail(emailConfig)
    .then(() => {
      emailSent = true;
    })
    .catch((error) => {
      console.log(error);
      if (error.response) {
        console.error(error.response.body);
      }
    });
  return emailSent;
};

const organizationSendEmail = async (emailOptions) => {
  let emailSent = false;
  if (!emailOptions.template && !emailOptions.html) {
    throw new Error('Please provide template or html content.');
  }
  const getOrganizationData = await models.OrganizationInfo.findOne({
    where: { user_id: emailOptions.organization_id },
  });
  const header_logo = await getOrganizationData.header_logo.then(
    (dataUrl) => dataUrl
  );
  /** ************** Retrive Email Template ****************** */
  const emailTemplate = await models.EmailTemplate.findOne({
    where: { email_template_key: emailOptions.template },
  });
  let htmlContent = emailTemplate.content;
  // const organizationName = getOrganizationData.company_name;
  // const sub = emailTemplate.subject;
  // const check = sub.includes('TelePath');
  // let subject = '';
  // if (check === true) {
  //   subject = sub.replace('TelePath', organizationName);
  // } else {
  //   subject = `${organizationName} ${sub}`;
  // }
  /** ************** Replace Dynamic Shortcodes in Email Content ****************** */

  const replacement = new RegExp(
    `{{${Object.keys(emailOptions.replacements).join('}}|{{')}}}`,
    'gi'
  );
  htmlContent = htmlContent.replace(
    replacement,
    (matched) =>
      emailOptions.replacements[matched.replace('{{', '').replace('}}', '')]
  );
  const emailConfig = {
    to: emailOptions.to,
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
    subject: `${emailTemplate.subject}`,
    html: `<html>

    <head></head>
    
    <body>
        <table width='100%' border='0' cellpadding='0' cellspacing='0' style='border-collapse: collapse ; margin: 0px ; padding: 0px ; table-layout: fixed ; width: 100% ; height: 90px;width: 640px ; margin: 0px auto ;'>
            <tbody>
                <tr>
                    <td align=' center' style='width: 640px ; margin: 0px auto ; background-color: #ECECEC ; background-size: cover;padding: 24px 0 38px; text-align:center' valign='top'>
                        <a href='#'>
                            <img alt='Organization' style="width: auto; height: 90px;" src="${header_logo}">
    
                        </a>
                    </td>
                </tr>
                <tr>
                    <td>
                        <br>
                        <p>${htmlContent}</p>
                        <strong>Thanks,</strong>
                        <br>
                        <strong>${getOrganizationData.company_name}</strong>
                        <br>
                        <br>
                    </td>
                </tr>
                <tr style='background-color: #484848;'>
                    <td class='content-block' style='text-align: center;width: 100%;padding-top: 20px;'>
    
                    </td>
                </tr>
                <tr style='background-color: #484848; '>
                    <td style='color: #fff; font-weight: 400; font-size: 16px; line-height: 15px; padding: 20px 0px;' align='center'>${'2023 by'} ${
      getOrganizationData.company_name
    }</td>
                </tr>
            </tbody>
        </table>
    </body>
    
    </html>`,
  };

  await transporter
    .sendMail(emailConfig)
    .then(() => {
      emailSent = true;
    })
    .catch((error) => {
      console.log(error);
      if (error.response) {
        console.error(error.response.body);
      }
    });
  return emailSent;
};
const sendEmailOfflineUser = async (data) => {
  const { to_user_id } = data;
  const user = await models.Users.scope([
    'defaultScope',
    'withUserTypeColumns',
  ]).findOne({
    where: {
      user_id: to_user_id,
    },
  });
  const template = 'telepath-notify-offline-user';
  if (user && user.user_type === 3) {
    await organizationSendEmail({
      to: user.email,
      organization_id: user.organation_id,
      template,
      replacements: {
        USERNAME: `${user.first_name} ${user.last_name}`,
      },
    });
  } else {
    await sendEmail({
      to: user.email,
      template,
      replacements: {
        USERNAME: `${user.first_name} ${user.last_name}`,
      },
    });
  }
};

module.exports = {
  sendEmail,
  sendEmailOfflineUser,
  organizationSendEmail,
};
