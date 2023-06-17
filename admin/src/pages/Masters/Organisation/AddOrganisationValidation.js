import Yup from 'helpers/customValidation';

let validationSchema = Yup.object({
  first_name: Yup.string('page.organisation_first_name_required').required(
    'page.organisation_first_name_required'
  ),
  last_name: Yup.string('page.organisation_last_name_required').required(
    'page.organisation_last_name_required'
  ),
  email: Yup.string('page.organisation_email_required')
    .required('page.organisation_email_required')
    .email('page.organisation_email_valid_validation'),
  admin_status: Yup.string('page.organisation_admin_status_required').required(
    'page.organisation_admin_status_required'
  ),
  phone: Yup.string()
    .required('page.organisation_phone_required')
    .phonecheck('page.organisation_mobile_number_match'),
  country_id: Yup.string('page.organisation_country_id_required').required(
    'page.organisation_country_id_required'
  ),
  // address: Yup.string('page.organisation_address_required').required(
  //   'page.organisation_address_required'
  // ),
  user_status: Yup.string('page.organisation_user_status_required').required(
    'page.organisation_user_status_required'
  ),
});

export default validationSchema;
