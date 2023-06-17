import * as Yup from 'yup';
let validationSchema = Yup.object({
  title: Yup.string('page.add_translation_title_required').required(
    'page.add_translation_title_required'
  ),
  seo_meta_title: Yup.string('page.add_translation_seo_meta_title_required').required(
    'page.add_translation_seo_meta_title_required'
  ),
  seo_meta_desc: Yup.string('page.add_translation_seo_meta_desc_required').required(
    'page.add_translation_seo_meta_desc_required'
  ),
  is_active: Yup.string('page.add_translation_is_active_required').required(
    'page.add_translation_is_active_required'
  ),
});

export default validationSchema;
