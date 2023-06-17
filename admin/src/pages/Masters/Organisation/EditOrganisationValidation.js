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
  timezone_id: Yup.string('page.organisation_timezone_id_required').required(
    'page.organisation_timezone_id_required'
  ),
  user_status: Yup.string('page.organisation_user_status_required').required(
    'page.organisation_user_status_required'
  ),
  reason: Yup.string('page.organisation_reason_required').when('admin_status', {
    is: (value) => value == 2,
    then: Yup.string('page.organisation_reason_required')
      .required('page.organisation_reason_required')
      .min(5, 'page.organisation_reason_required_min_validation'),
    otherwise: Yup.string().optional(),
  }),
  doctor_visit_fee: Yup.string('page.doctor_visit_fee_required')
    .maxlength('page.doctor_visit_fee_max')
    .priceValidation('page.doctor_visit_fee_valid'),
  telemedicine_platform_fee: Yup.string('page.telemedicine_platform_fee_required')
    .maxlength('page.telemedicine_platform_fee_max')
    .priceValidation('page.telemedicine_platform_fee_valid'),
});

export default validationSchema;
