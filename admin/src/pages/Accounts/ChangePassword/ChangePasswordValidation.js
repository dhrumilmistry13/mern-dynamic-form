import * as Yup from 'yup';
let validationSchema = Yup.object({
  old_password: Yup.string().required('page.change_old_password_validation_required'),
  new_password: Yup.string()
    .required('page.change_new_password_validation_required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*)[A-Za-z\d@$!%*#?&]{6,}$/,
      'page.change_new_password_validation_matches'
    ),
  confirm_password: Yup.string()
    .required('page.change_confirm_password_validation_required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*)[A-Za-z\d@$!%*#?&]{6,}$/,
      'page.change_confirm_password_validation_matches'
    )
    .oneOf([Yup.ref('new_password'), null], 'page.change_confirm_password_validation_oneOf'),
});

export default validationSchema;
