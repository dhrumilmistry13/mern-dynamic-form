import * as Yup from 'yup';

let validationSchema = Yup.object({
  name: Yup.string('page.SpecialitiesPage_name_required').required(
    'page.SpecialitiesPage_name_required'
  ),
  sequence: Yup.string('page.SpecialitiesPage_sequence_required').required(
    'page.SpecialitiesPage_sequence_required'
  ),
  status: Yup.string('page.SpecialitiesPage_status_required').required(
    'page.SpecialitiesPage_status_required'
  ),
});

export default validationSchema;
