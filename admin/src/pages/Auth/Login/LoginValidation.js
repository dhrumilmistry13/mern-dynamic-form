import * as Yup from 'yup';
let validationSchema = Yup.object({
  email: Yup.string('page.login_email_validation_required')
    .email('page.login_email_validation_email')
    .required('page.login_email_validation_required'),
  password: Yup.string('page.login_password_validation_required').required(
    'page.login_password_validation_required'
  ),
});

export default validationSchema;
