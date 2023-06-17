import * as Yup from 'yup';
let validationSchema = Yup.object({
  key: Yup.string('page.add_translation_key_required').required(
    'page.add_translation_key_required'
  ),
  text: Yup.string('page.add_translation_text_required').required(
    'page.add_translation_text_required'
  ),
});

export default validationSchema;
