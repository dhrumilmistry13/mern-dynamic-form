import * as Yup from 'yup';

let validationSchema = Yup.object({
  verification_otp: Yup.string()
    .required('page.otpverification_otp_required')
    .matches(/^[0-9\s]+$/, 'page.otpverification_otp_matches'),
});

export default validationSchema;
