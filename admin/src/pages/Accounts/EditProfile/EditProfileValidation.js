import Yup from 'helpers/customValidation';
let validationSchema = Yup.object({
  first_name: Yup.string()
    .required('page.profile_first_name_required')
    .matches(/^[aA-zZ\s]+$/, 'page.add_edit_profile_first_name_alphabates_validation'),
  last_name: Yup.string()
    .required('page.profile_last_name_required')
    .matches(/^[aA-zZ\s]+$/, 'page.add_edit_profile_last_name_alphabates_validation'),
  email: Yup.string('page.profile_email_required')
    .email('page.login_email_validation_email')
    .required('page.profile_email_required'),

  phone: Yup.string()
    .required('page.profile_phone_required')
    .phonecheck('page.profile_mobile_number_match'),
  country_id: Yup.string('page.profile_country_id_required').required(
    'page.profile_country_id_required'
  ),
});
let validationSchemaemail = Yup.object({
  email: Yup.string('page.profile_email_required')
    .email('page.login_email_validation_email')
    .required('page.profile_email_required'),
});
let validationSchemaVerfiy = Yup.object({
  verification_otp: Yup.string()
    .required('page.profile_email_otp_required')
    .matches(/^[0-9\s]+$/, 'page.profile_email_otp_matches'),
});
export { validationSchema, validationSchemaemail, validationSchemaVerfiy };
