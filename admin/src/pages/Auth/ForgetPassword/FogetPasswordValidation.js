import * as Yup from 'yup';
let validationSchema = Yup.object({
  email: Yup.string('page.forget_password_email_validation_required')
    .email('page.forget_password_email_validation_email')
    .required('page.forget_password_email_validation_required'),
});

export default validationSchema;
