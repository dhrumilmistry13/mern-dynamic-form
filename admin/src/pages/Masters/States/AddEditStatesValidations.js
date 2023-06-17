import * as Yup from 'yup';

let validationSchema = Yup.object({
  name: Yup.string('page.states_name_validation').required('page.states_name_validation'),
  short_code: Yup.string('page.states_short_code_required').required(
    'page.states_short_code_required'
  ),
  sequence: Yup.string('page.states_sequence_required').required('page.states_sequence_required'),

  status: Yup.string('page.states_status_required').required('page.states_status_required'),
});

export default validationSchema;
