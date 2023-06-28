import Yup from 'helpers/customValidation';

let validationSchema = Yup.object({
  label: Yup.string('page.admin_question_label_validation_required')
    .required('page.admin_question_label_validation_required')
    .min(1, 'page.admin_question_label_validation_min')
    .max(255, 'page.admin_question_label_validation_max'),
  question_type: Yup.string('page.admin_question_question_type_validation_required').required(
    'page.admin_question_question_type_validation_required'
  ),
  is_required: Yup.string('page.admin_question_is_required_validation_required').required(
    'page.admin_question_is_required_validation_required'
  ),
  sequence: Yup.string('page.admin_question_sequence_validation_required').required(
    'page.admin_question_sequence_validation_required'
  ),
  status: Yup.string('page.admin_question_status_validation_required').required(
    'page.admin_question_status_validation_required'
  ),
  question_options: Yup.array().when('question_type', (val) => {
    if ([3, 4, 5].includes(parseInt(val))) {
      return Yup.array()
        .unique('page.admin_question_option_value_validation_unique')
        .min(2, 'page.admin_question_option_value_validation_min')
        .of(
          Yup.object().shape({
            option_value: Yup.string()
              .trim()
              .required('page.admin_question_option_value_validation_required')
              .min(1, 'page.admin_question_option_value_validation_min_value'),
          })
        );
    } else {
      return Yup.array().notRequired();
    }
  }),
});

export default validationSchema;
