import Yup from 'helpers/customValidation';

let validationSchema = Yup.object({
  name: Yup.string('page.our_team_name_required').required('page.our_team_name_required'),
  designation: Yup.string('page.our_team_designamtion_required').required(
    'page.our_team_designamtion_required'
  ),
  our_team_image: Yup.mixed('page.our_team_image_required')
    .file_type('page.our_team_image_required_type')
    .required('page.our_team_image_required'),
  is_active: Yup.string('page.add_our_team_is_active_required').required(
    'page.add_our_team_is_active_required'
  ),
});

export default validationSchema;
