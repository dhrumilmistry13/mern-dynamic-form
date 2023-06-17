import * as Yup from 'yup';
let validationSchema = Yup.object({
  title: Yup.string('page.email_template_title_required').required(
    'page.email_template_title_required'
  ),
  email_template_key: Yup.string('page.email_template_key_required').required(
    'page.email_template_key_required'
  ),
  parameter: Yup.string('page.email_template_parameter_required').required(
    'page.email_template_parameter_required'
  ),
  subject: Yup.string('page.email_template_subject_required').required(
    'page.email_template_subject_required'
  ),
});

export default validationSchema;
