import * as Yup from 'yup';
let validationSchema = Yup.object({
  new_password: Yup.string()
    .required('page.reset_password_password_validation_required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*)[A-Za-z\d@$!%*#?&]{6,}$/,
      'page.reset_password_password_validation_matches'
    ),
  confirm_password: Yup.string()
    .required('page.reset_password_confirm_password_validation_required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*)[A-Za-z\d@$!%*#?&]{6,}$/,
      'page.reset_password_confirm_password_validation_matches'
    )
    .oneOf(
      [Yup.ref('new_password'), null],
      'page.reset_passsword_confirm_password_validation_oneOf'
    ),
});

export default validationSchema;
