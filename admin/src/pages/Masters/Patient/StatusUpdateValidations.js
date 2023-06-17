import * as Yup from 'yup';
let validationSchema = Yup.object({
  reason: Yup.string('page.organisation_status_update_reason_required')
    .required('page.organisation_status_update_reason_required')
    .min(5, 'page.organisation_status_update_reason_validation_min'),
});

export default validationSchema;
