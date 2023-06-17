import Yup from 'helpers/customValidation';

let validationSchema = Yup.object({
  name: Yup.string('page.formulary_name_required').required('page.formulary_name_required'),
  ndc: Yup.string('page.formulary_ndc_required').required('page.formulary_ndc_required'),
  dosage_amount: Yup.string('page.formulary_dosage_amount_required')
    .required('page.formulary_dosage_amount_required')
    .maxlength('page.formulary_dosage_amount_max'),
  price: Yup.string('page.formulary_price_required')
    .required('page.formulary_price_required')
    .maxlengthPriceShippingfee('page.formulary_price_max')
    .priceShippingfeeValidation('page.formulary_price_valid'),
  packing_shipping_fee: Yup.string('page.formulary_packaging_shipping_fee_required')
    .required('page.formulary_packaging_shipping_fee_required')
    .maxlengthPriceShippingfee('page.formulary_packaging_shipping_fee_max')
    .priceShippingfeeValidation('page.formulary_packaging_shipping_fee_valid'),
  description: Yup.string('page.formulary_description_required').required(
    'page.formulary_description_required'
  ),
  short_description: Yup.string('page.formulary_short_description_required').required(
    'page.formulary_short_description_required'
  ),
  sequence: Yup.string('page.formulary_sequence_required').required(
    'page.formulary_sequence_required'
  ),
  featured_image: Yup.mixed('page.formulary_featured_image_required')
    .required('page.formulary_featured_image_required')
    .file_type('page.formulary_featured_image_required_type'),
  formulary_image: Yup.array()
    .required('page.formulary_image_required')
    .min(1, 'page.formulary_image_required')
    .multiplefilecheck('page.formulary_image_required_type'),

  status: Yup.string('page.formulary_status_required').required('page.formulary_status_required'),
  is_appointment_required: Yup.string('page.formulary_is_appointment_required_required').required(
    'page.formulary_is_appointment_required_required'
  ),
});

export default validationSchema;
