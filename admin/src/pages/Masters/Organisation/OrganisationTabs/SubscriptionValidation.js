import * as Yup from 'yup';

let validationSchema = Yup.object({
  amount: Yup.string('page.subscription_amount_validation_required')
    .required('page.subscription_amount_validation_required')
    .priceValidation('page.subscription_amount_validation_price'),
});

export default validationSchema;
