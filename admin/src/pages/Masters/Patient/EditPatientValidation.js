import * as Yup from 'yup';
let validationSchema = Yup.object({
  first_name: Yup.string('page.patient_first_name_required').required(
    'page.patient_first_name_required'
  ),
  last_name: Yup.string('page.patient_last_name_required').required(
    'page.patient_last_name_required'
  ),
  email: Yup.string('page.patient_email_required')
    .required('page.patient_email_required')
    .email('page.patient_email_valid_validation'),
  admin_status: Yup.string('page.patient_admin_status_required').required(
    'page.patient_admin_status_required'
  ),
  user_status: Yup.string('page.patient_user_status_required').required(
    'page.patient_user_status_required'
  ),
  reason: Yup.string('page.patient_reason_required').when('admin_status', {
    is: (value) => value == 2,
    then: Yup.string('page.patient_reason_required')
      .required('page.patient_reason_required')
      .min(3, 'page.patient_reason_required_min_validation'),
    otherwise: Yup.string().optional(),
  }),
});

export default validationSchema;
