const { Joi } = require('express-validation');

class PatientAuthValidator {
  patientSignupValidation() {
    return {
      body: Joi.object({
        account_type: Joi.number().required().valid(1, 2, 3).messages({
          'string.empty': 'admin.patient_account_type_required',
          'string.base': 'admin.patient_account_type_required',
          'string.valid': 'admin.patient_account_type_invalid',
          'any.required': 'admin.patient_account_type_required',
        }),
        password: Joi.when('account_type', {
          is: 1,
          then: Joi.string()
            .required()
            .min(8)
            .max(255)
            .pattern(
              /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
            )
            .messages({
              'string.empty':
                'admin.patient_signup_password_validation_required',
              'string.base':
                'admin.patient_signup_password_validation_required',
              'string.min': 'admin.patient_signup_password_validation_min',
              'string.pattern.base':
                'admin.patient_signup_password_validation_pattern',
              'string.max': 'admin.patient_signup_password_validation_max',
              'any.required':
                'admin.patient_signup_password_validation_required',
            }),
          otherwise: Joi.optional(),
        }),
        confirm_password: Joi.when('account_type', {
          is: 1,
          then: Joi.string()
            .min(6)
            .max(255)
            .valid(Joi.ref('password'))
            .required()
            .label('Confirm password')
            .messages({
              'string.empty':
                'admin.organization_signup_confirm_password_validation_required',
              'string.base':
                'admin.organization_signup_confirm_password_validation_required',
              'string.min':
                'admin.organization_signup_confirm_password_validation_min',
              'string.max':
                'admin.organization_signup_confirm_password_validation_max',
              'any.required':
                'admin.organization_signup_confirm_password_validation_required',
              'string.valid':
                'admin.organization_signup_confirm_password_validation_valid',
            }),
          otherwise: Joi.optional().options({
            messages: { 'any.only': '{{#label}} does not match' },
          }),
        }),

        gmail_id: Joi.when('account_type', {
          is: 2,
          then: Joi.string().required().messages({
            'string.empty': 'admin.patient_gmail_id_required',
            'string.base': 'admin.patient_gmail_id_required',
            'any.required': 'admin.patient_gmail_id_required',
          }),
          otherwise: Joi.optional(),
        }),
        is_gmail_email_verify: Joi.when('account_type', {
          is: 2,
          then: Joi.number().required().messages({
            'string.empty': 'admin.patient_is_gmail_email_verify_required',
            'string.base': 'admin.patient_is_gmail_email_verify_required',
            'any.required': 'admin.patient_is_gmail_email_verify_required',
          }),
          otherwise: Joi.optional(),
        }),
        facebook_id: Joi.when('account_type', {
          is: 3,
          then: Joi.string().required().messages({
            'string.empty': 'admin.patient_facebook_id_required',
            'string.base': 'admin.patient_facebook_id_required',
            'any.required': 'admin.patient_facebook_id_required',
          }),
          otherwise: Joi.optional(),
        }),
        is_fb_email_verify: Joi.when('account_type', {
          is: 3,
          then: Joi.number().required().messages({
            'string.empty': 'admin.patient_is_fb_email_verify_required',
            'string.base': 'admin.patient_is_fb_email_verify_required',
            'any.required': 'admin.patient_is_fb_email_verify_required',
          }),
          otherwise: Joi.optional(),
        }),
        first_name: Joi.string().max(25).trim(true).required().messages({
          'string.empty': 'admin.patient_signup_first_name_validation_required',
          'string.base': 'admin.patient_signup_first_name_validation_required',
          'string.max': 'admin.patient_signup_first_name_validation_max',
          'any.required': 'admin.patient_signup_first_name_validation_required',
        }),
        last_name: Joi.string().max(25).trim(true).required().messages({
          'string.empty': 'admin.patient_signup_last_name_validation_required',
          'string.base': 'admin.patient_signup_last_name_validation_required',
          'string.max': 'admin.patient_signup_last_name_validation_max',
          'any.required': 'admin.patient_signup_last_name_validation_required',
        }),
        email: Joi.string().max(100).email().trim(true).required().messages({
          'string.empty': 'admin.patient_signup_email_validation_required',
          'string.base': 'admin.patient_signup_email_validation_required',
          'string.max': 'admin.patient_signup_email_validation_max',
          'string.email': 'admin.patient_signup_email_validation_valid',
          'any.required': 'admin.patient_signup_email_validation_required',
        }),
        country_id: Joi.number().required().messages({
          'string.base': 'admin.patient_profile_country_id_validation_required',
          'any.required':
            'admin.patient_profile_country_id_validation_required',
          'string.empty':
            'admin.patient_profile_country_id_validation_required',
        }),
        phone: Joi.string().required().min(10).max(10).trim(true).messages({
          'string.base': 'admin.patient_profile_phone_validation_required',
          'string.max': 'admin.patient_profile_phone_validation_max',
          'string.min': 'admin.patient_profile_phone_validation_min',
          'any.required': 'admin.patient_profile_phone_validation_required',
          'string.empty': 'admin.patient_profile_phone_validation_required',
        }),
        confirmation_check: Joi.optional(),
      }),
    };
  }

  verifyPatientOtpValidation() {
    return {
      body: Joi.object({
        encodedToken: Joi.string().trim(true).required().messages({
          'string.empty':
            'admin.patient_verify_otp_encoded_token_validation_required',
          'string.base':
            'admin.patient_verify_otp_encoded_token_validation_required',
          'any.required':
            'admin.patient_verify_otp_encoded_token_validation_required',
        }),
        verification_otp: Joi.number()
          .integer()
          .max(999999)
          .min(0)
          .required()
          .messages({
            'number.base':
              'admin.patient_verify_otp_verification_otp_validation_required',
            'any.required':
              'admin.patient_verify_otp_verification_otp_validation_required',
            'any.min':
              'admin.patient_verify_otp_verification_otp_validation_min',
            'any.max':
              'admin.patient_verify_otp_verification_otp_validation_max',
          }),
        account_type: Joi.number().required().valid(1, 2, 3).messages({
          'string.empty': 'admin.patient_account_type_required',
          'string.base': 'admin.patient_account_type_required',
          'string.valid': 'admin.patient_account_type_invalid',
          'any.required': 'admin.patient_account_type_required',
        }),
      }),
    };
  }

  patientResendOTPValidation() {
    return {
      body: Joi.object({
        encoded_token: Joi.string().trim(true).required().messages({
          'string.empty':
            'admin.patient_verify_otp_encoded_token_validation_required',
          'string.base':
            'admin.patient_verify_otp_encoded_token_validation_required',
          'any.required':
            'admin.patient_verify_otp_encoded_token_validation_required',
        }),
      }),
    };
  }

  patientverifyForgotEmailOtpValidation() {
    return {
      body: Joi.object({
        encoded_token: Joi.string().trim(true).required().messages({
          'string.empty':
            'admin.patient_verify_otp_encoded_token_validation_required',
          'string.base':
            'admin.patient_verify_otp_encoded_token_validation_required',
          'any.required':
            'admin.patient_verify_otp_encoded_token_validation_required',
        }),
        verification_otp: Joi.number()
          .integer()
          .max(999999)
          .min(0)
          .required()
          .messages({
            'number.base':
              'admin.patient_verify_otp_verification_otp_validation_required',
            'any.required':
              'admin.patient_verify_otp_verification_otp_validation_required',
            'any.min':
              'admin.patient_verify_otp_verification_otp_validation_min',
            'any.max':
              'admin.patient_verify_otp_verification_otp_validation_max',
          }),
      }),
    };
  }

  patientResetPasswordValidation() {
    return {
      body: Joi.object({
        resetToken: Joi.string().trim(true).required().messages({
          'string.empty':
            'admin.patient_reset_password_reset_token_validation_required',
          'string.base':
            'admin.patient_reset_password_reset_token_validation_required',
          'any.required':
            'admin.patient_reset_password_reset_token_validation_required',
        }),
        new_password: Joi.string()
          .min(8)
          .max(255)
          .trim(true)
          .pattern(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
          )
          .required()
          .messages({
            'string.empty':
              'admin.patient_reset_password_new_password_validation_required',
            'string.base':
              'admin.patient_reset_password_new_password_validation_required',
            'string.min':
              'admin.patient_reset_password_new_password_validation_min',
            'string.pattern.base':
              'admin.patient_reset_password_new_password_validation_pattern',
            'string.max':
              'admin.patient_reset_password_new_password_validation_max',
            'any.required':
              'admin.patient_reset_password_new_password_validation_required',
          }),
        confirm_password: Joi.string()
          .min(8)
          .max(255)
          .valid(Joi.ref('new_password'))
          .required()
          .pattern(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
          )
          .messages({
            'string.empty':
              'admin.patient_reset_password_confirm_password_validation_required',
            'string.base':
              'admin.patient_reset_password_confirm_password_validation_required',
            'string.min':
              'admin.patient_reset_password_confirm_password_min_length_error',
            'string.max':
              'admin.patient_reset_password_confirm_password_max_length_exceed',
            'any.required':
              'admin.patient_reset_password_confirm_password_validation_required',
            'string.valid':
              'admin.patient_reset_password_confirm_password_validation_valid',
            'string.pattern.base':
              'admin.patient_reset_password_confirm_password_validation_pattern',
          })
          .options({ messages: { 'any.only': '{{#label}} does not match' } }),
      }),
    };
  }

  patientLoginValidation() {
    return {
      body: Joi.object({
        account_type: Joi.number().required().valid(1, 2, 3).messages({
          'string.empty': 'admin.patient_account_type_required',
          'string.base': 'admin.patient_account_type_required',
          'string.valid': 'admin.patient_account_type_invalid',
          'any.required': 'admin.patient_account_type_required',
        }),
        password: Joi.when('account_type', {
          is: 1,
          then: Joi.string().required().min(8).max(255).messages({
            'string.empty': 'admin.patient_password_validation_required',
            'string.base': 'admin.patient_password_validation_required',
            'string.min': 'admin.patient_password_validation_min',
            'string.max': 'admin.patient_password_validation_max',
            'any.required': 'admin.patient_password_validation_required',
          }),
          otherwise: Joi.optional(),
        }),
        gmail_id: Joi.when('account_type', {
          is: 2,
          then: Joi.string().required().messages({
            'string.empty': 'admin.patient_gmail_id_required',
            'string.base': 'admin.patient_gmail_id_required',
            'any.required': 'admin.patient_gmail_id_required',
          }),
          otherwise: Joi.optional(),
        }),
        facebook_id: Joi.when('account_type', {
          is: 3,
          then: Joi.string().required().messages({
            'string.empty': 'admin.patient_facebook_id_required',
            'string.base': 'admin.patient_facebook_id_required',
            'any.required': 'admin.patient_facebook_id_required',
          }),
          otherwise: Joi.optional(),
        }),
        email: Joi.string().max(100).email().trim(true).messages({
          'string.empty': 'admin.patient_email_validation_required',
          'string.base': 'admin.patient_email_validation_required',
          'string.max': 'admin.patient_email_validation_max',
          'string.email': 'admin.patient_email_validation_valid',
        }),
      }),
    };
  }

  patientForgotPasswordValidation() {
    return {
      body: Joi.object({
        email: Joi.string().max(100).email().trim(true).required().messages({
          'string.empty': 'admin.patient_signup_email_validation_required',
          'string.base': 'admin.patient_signup_email_validation_required',
          'string.max': 'admin.patient_signup_email_validation_max',
          'string.email': 'admin.patient_signup_email_validation_valid',
          'any.required': 'admin.patient_signup_email_validation_required',
        }),
      }),
    };
  }

  editPatientProfileValidation() {
    return {
      body: Joi.object({
        user_id: Joi.string().trim(true).required().messages({
          'string.empty': 'admin.patient_profile_user_id_validation_required',
          'string.base': 'admin.patient_profile_user_id_validation_required',
          'any.required': 'admin.patient_profile_user_id_validation_required',
        }),
        country_id: Joi.number().required().messages({
          'string.base': 'admin.patient_profile_country_id_validation_required',
          'any.required':
            'admin.patient_profile_country_id_validation_required',
          'string.empty':
            'admin.patient_profile_country_id_validation_required',
        }),
        first_name: Joi.string().max(25).trim(true).required().messages({
          'string.empty':
            'admin.patient_profile_first_name_validation_required',
          'string.base': 'admin.patient_profile_first_name_validation_required',
          'string.max': 'admin.patient_profile_first_name_validation_max',
          'any.required':
            'admin.patient_profile_first_name_validation_required',
        }),
        last_name: Joi.string().max(25).trim(true).required().messages({
          'string.empty': 'admin.patient_profile_last_name_validation_required',
          'string.base': 'admin.patient_profile_last_name_validation_required',
          'string.max': 'admin.patient_profile_last_name_validation_max',
          'any.required': 'admin.patient_profile_last_name_validation_required',
        }),
        phone: Joi.string().required().min(10).max(10).trim(true).messages({
          'string.base': 'admin.patient_profile_phone_validation_required',
          'string.max': 'admin.patient_profile_phone_validation_max',
          'string.min': 'admin.patient_profile_phone_validation_min',
          'any.required': 'admin.patient_profile_phone_validation_required',
          'string.empty': 'admin.patient_profile_phone_validation_required',
        }),
        profile_image: Joi.optional(),
      }),
    };
  }

  editPatientEmailValidation() {
    return {
      body: Joi.object({
        email: Joi.string().max(100).trim(true).email().required().messages({
          'string.base': 'admin.patient_profile_email_validation_required',
          'string.max': 'admin.patient_profile_email_validation_max',
          'any.required': 'admin.patient_profile_email_validation_required',
          'string.email': 'admin.patient_profile_email_validation_email',
        }),
      }),
    };
  }

  verifyNewPatientEmailValidation() {
    return {
      body: Joi.object({
        encodedToken: Joi.string().trim(true).required().messages({
          'string.base': 'admin.patient_verify_email_endcode_token_required',
          'any.required': 'admin.patient_verify_email_endcode_token_required',
        }),
        verification_otp: Joi.string()
          .trim(true)
          .required()
          .min(6)
          .max(6)
          .messages({
            'string.base':
              'admin.patient_verify_email_verification_otp_required',
            'string.max': 'admin.patient_verify_email_verification_otp_max',
            'string.min': 'admin.patient_verify_email_verification_otp_min',
            'any.required':
              'admin.patient_verify_email_verification_otp_required',
          }),
      }),
    };
  }

  NewPatientEmailResendOTPValidation() {
    return {
      body: Joi.object({
        encodedToken: Joi.string().trim(true).required().messages({
          'string.base': 'admin.patient_verify_email_endcode_token_required',
          'any.required': 'admin.patient_verify_email_endcode_token_required',
        }),
      }),
    };
  }

  patientChangePasswordValidation() {
    return {
      body: Joi.object({
        old_password: Joi.string()
          .min(8)
          .max(255)
          .trim(true)
          .required()
          .messages({
            'string.base':
              'admin.patient_change_password_old_password_validation_required',
            'string.min':
              'admin.patient_change_password_old_password_validation_min',
            'string.max':
              'admin.patient_change_password_old_password_validation_max',
            'any.required':
              'admin.patient_change_password_old_password_validation_required',
          }),
        new_password: Joi.string()
          .min(8)
          .max(255)
          .trim(true)
          .pattern(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
          )
          .required()
          .messages({
            'string.empty':
              'admin.patient_change_password_new_password_validation_required',
            'string.base':
              'admin.patient_change_password_new_password_validation_required',
            'string.min':
              'admin.patient_change_password_new_password_validation_min',
            'string.pattern.base':
              'admin.patient_change_password_new_password_validation_pattern',
            'string.max':
              'admin.patient_change_password_new_password_validation_max',
            'any.required':
              'admin.patient_change_password_new_password_validation_required',
          }),
        confirm_password: Joi.string()
          .min(8)
          .max(255)
          .valid(Joi.ref('new_password'))
          .required()
          .pattern(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
          )
          .messages({
            'string.empty':
              'admin.patient_change_password_confirm_password_validation_required',
            'string.base':
              'admin.patient_change_password_confirm_password_validation_required',
            'string.min':
              'admin.patient_change_password_confirm_password_min_length_error',
            'string.max':
              'admin.patient_change_password_confirm_password_max_length_exceed',
            'any.required':
              'admin.patient_change_password_confirm_password_validation_required',
            'string.valid':
              'admin.patient_change_password_confirm_password_validation_valid',
            'string.pattern.base':
              'admin.patient_change_password_confirm_password_validation_pattern',
          })
          .options({ messages: { 'any.only': '{{#label}} does not match' } }),
      }),
    };
  }

  patientStoreGeneralDetailsValidation() {
    return {
      body: Joi.object({
        answers: Joi.array()
          .items(
            Joi.object().keys({
              user_question_ans_id: Joi.number().required().messages({
                'any.required':
                  'admin.patient_general_details_user_question_ans_id_validation_required',
              }),
              question_id: Joi.number().required().messages({
                'any.required':
                  'admin.patient_general_details_question_id_validation_required',
              }),
              is_required: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.patient_general_details_is_required_validation_required',
                'any.required':
                  'admin.patient_general_details_is_required_validation_required',
                'any.base.valid':
                  'admin.patient_general_details_is_required_validation_valid',
              }),
              question_type: Joi.number()
                .required()
                .valid(1, 2, 3, 4, 5, 6, 7, 8)
                .messages({
                  'number.base':
                    'admin.patient_general_details_question_type_validation_required',
                  'any.required':
                    'admin.patient_general_details_question_type_validation_required',
                  'any.base.valid':
                    'admin.patient_general_details_question_type_validation_valid',
                }),
              ans_value: Joi.when('question_type', {
                is: [1, 2, 6, 7, 8],
                then: Joi.when('is_requeired', {
                  is: 1,
                  then: Joi.string().required().min(1).messages({
                    'string.empty':
                      'admin.patient_general_details_ans_value_validation_required',
                    'any.required':
                      'admin.patient_general_details_ans_value_validation_required',
                    'string.base':
                      'admin.patient_general_details_ans_value_validation_required',
                    'string.min':
                      'admin.patient_general_details_ans_value_validation_min',
                  }),
                  otherwise: Joi.optional(),
                }),
                otherwise: Joi.optional(),
              }),
              ans_type: Joi.number().required().valid(1, 2, 3, 4).messages({
                'number.base':
                  'admin.patient_general_details_ans_type_validation_required',
                'any.required':
                  'admin.patient_general_details_ans_type_validation_required',
                'any.base.valid':
                  'admin.patient_general_details_ans_type_validation_valid',
              }),
              question_text: Joi.string().required().min(1).messages({
                'string.empty':
                  'admin.patient_general_details_question_text_validation_required',
                'any.required':
                  'admin.patient_general_details_question_text_validation_required',
                'string.base':
                  'admin.patient_general_details_question_text_validation_required',
                'string.min':
                  'admin.patient_general_details_question_text_validation_min',
                'string.max':
                  'admin.patient_general_details_question_text_validation_max',
              }),
              is_delete: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.patient_general_details_is_delete_validation_required',
                'any.required':
                  'admin.patient_general_details_is_delete_validation_required',
                'any.base.valid':
                  'admin.patient_general_details_is_delete_validation_valid',
              }),
              is_new: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.patient_general_details_is_new_validation_required',
                'any.required':
                  'admin.patient_general_details_is_new_validation_required',
                'any.base.valid':
                  'admin.patient_general_details_is_new_validation_valid',
              }),
              user_question_ans_option: Joi.array()
                .when('question_type', {
                  is: [3, 4, 5],
                  then: Joi.array()
                    .items(
                      Joi.object().keys({
                        option_value: Joi.string().min(1).required().messages({
                          'string.empty':
                            'admin.patient_general_details_option_value_validation_required',
                          'string.min':
                            'admin.patient_general_details_option_value_validation_min',
                          'string.base':
                            'admin.patient_general_details_option_value_validation_required',
                          'any.required':
                            'admin.patient_general_details_option_value_validation_required',
                        }),
                        user_question_ans_option_id: Joi.number()
                          .required()
                          .messages({
                            'number.base':
                              'admin.patient_general_details_user_question_ans_option_id_validation_required',
                            'any.required':
                              'admin.patient_general_details_user_question_ans_option_id_validation_required',
                          }),
                        is_delete: Joi.number()
                          .required()
                          .valid(1, 2)
                          .messages({
                            'number.base':
                              'admin.patient_general_details_is_delete_validation_required',
                            'any.required':
                              'admin.patient_general_details_is_delete_validation_required',
                            'any.base.valid':
                              'admin.patient_general_details_is_delete_validation_valid',
                          }),
                        is_new: Joi.number().required().valid(1, 2).messages({
                          'number.base':
                            'admin.patient_general_details_is_new_validation_required',
                          'any.required':
                            'admin.patient_general_details_is_new_validation_required',
                          'any.base.valid':
                            'admin.patient_general_details_is_new_validation_valid',
                        }),
                        question_option_id: Joi.number().required().messages({
                          'number.base':
                            'admin.patient_general_details_question_option_id_validation_required',
                          'any.required':
                            'admin.patient_general_details_question_option_id_validation_required',
                        }),
                      })
                    )
                    .min(1)
                    .unique((a, b) => a.option_value === b.option_value),
                  otherwise: Joi.optional(),
                })
                .messages({
                  'any.required':
                    'admin.patient_general_details_question_options_validation_required',
                  'array.min':
                    'admin.patient_general_details_question_options_validation_min_option',
                  'array.unique':
                    'admin.patient_general_details_question_options_validation_unique',
                }),
            })
          )
          .min(1)
          .messages({
            'any.required':
              'admin.patient_general_details_answers_validation_required',
            'array.min':
              'admin.patient_general_details_answers_validation_min_option',
            'array.unique':
              'admin.patient_general_details_answers_validation_unique',
          }),
        country_id: Joi.optional(),
        phone: Joi.optional(),
      }),
    };
  }

  patientStoreInsuranceDetailsValidation() {
    return {
      body: Joi.object({
        answers: Joi.array()
          .items(
            Joi.object().keys({
              user_question_ans_id: Joi.number().required().messages({
                'any.required':
                  'admin.patient_insurance_details_user_question_ans_id_validation_required',
              }),
              question_id: Joi.number().required().messages({
                'any.required':
                  'admin.patient_insurance_details_question_id_validation_required',
              }),
              is_required: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.patient_insurance_details_is_required_validation_required',
                'any.required':
                  'admin.patient_insurance_details_is_required_validation_required',
                'any.base.valid':
                  'admin.patient_insurance_details_is_required_validation_valid',
              }),
              question_type: Joi.number()
                .required()
                .valid(1, 2, 3, 4, 5, 6, 7, 8)
                .messages({
                  'number.base':
                    'admin.patient_insurance_details_question_type_validation_required',
                  'any.required':
                    'admin.patient_insurance_details_question_type_validation_required',
                  'any.base.valid':
                    'admin.patient_insurance_details_question_type_validation_valid',
                }),
              ans_value: Joi.when('question_type', {
                is: [1, 2, 6, 7, 8],
                then: Joi.when('is_requeired', {
                  is: 1,
                  then: Joi.string().required().min(1).messages({
                    'string.empty':
                      'admin.patient_insurance_details_ans_value_validation_required',
                    'any.required':
                      'admin.patient_insurance_details_ans_value_validation_required',
                    'string.base':
                      'admin.patient_insurance_details_ans_value_validation_required',
                    'string.min':
                      'admin.patient_insurance_details_ans_value_validation_min',
                  }),
                  otherwise: Joi.optional(),
                }),
                otherwise: Joi.optional(),
              }),
              ans_type: Joi.number().required().valid(1, 2, 3, 4).messages({
                'number.base':
                  'admin.patient_insurance_details_ans_type_validation_required',
                'any.required':
                  'admin.patient_insurance_details_ans_type_validation_required',
                'any.base.valid':
                  'admin.patient_insurance_details_ans_type_validation_valid',
              }),
              question_text: Joi.string().required().min(1).messages({
                'string.empty':
                  'admin.patient_insurance_details_question_text_validation_required',
                'any.required':
                  'admin.patient_insurance_details_question_text_validation_required',
                'string.base':
                  'admin.patient_insurance_details_question_text_validation_required',
                'string.min':
                  'admin.patient_insurance_details_question_text_validation_min',
                'string.max':
                  'admin.patient_insurance_details_question_text_validation_max',
              }),
              is_delete: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.patient_insurance_details_is_delete_validation_required',
                'any.required':
                  'admin.patient_insurance_details_is_delete_validation_required',
                'any.base.valid':
                  'admin.patient_insurance_details_is_delete_validation_valid',
              }),
              is_new: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.patient_insurance_details_is_new_validation_required',
                'any.required':
                  'admin.patient_insurance_details_is_new_validation_required',
                'any.base.valid':
                  'admin.patient_insurance_details_is_new_validation_valid',
              }),
              user_question_ans_option: Joi.array()
                .when('question_type', {
                  is: [3, 4, 5],
                  then: Joi.array()
                    .items(
                      Joi.object().keys({
                        option_value: Joi.string().min(1).required().messages({
                          'string.empty':
                            'admin.patient_insurance_details_option_value_validation_required',
                          'string.min':
                            'admin.patient_insurance_details_option_value_validation_min',
                          'string.base':
                            'admin.patient_insurance_details_option_value_validation_required',
                          'any.required':
                            'admin.patient_insurance_details_option_value_validation_required',
                        }),
                        user_question_ans_option_id: Joi.number()
                          .required()
                          .messages({
                            'number.base':
                              'admin.patient_insurance_details_user_question_ans_option_id_validation_required',
                            'any.required':
                              'admin.patient_insurance_details_user_question_ans_option_id_validation_required',
                          }),
                        is_delete: Joi.number()
                          .required()
                          .valid(1, 2)
                          .messages({
                            'number.base':
                              'admin.patient_insurance_details_is_delete_validation_required',
                            'any.required':
                              'admin.patient_insurance_details_is_delete_validation_required',
                            'any.base.valid':
                              'admin.patient_insurance_details_is_delete_validation_valid',
                          }),
                        is_new: Joi.number().required().valid(1, 2).messages({
                          'number.base':
                            'admin.patient_insurance_details_is_new_validation_required',
                          'any.required':
                            'admin.patient_insurance_details_is_new_validation_required',
                          'any.base.valid':
                            'admin.patient_insurance_details_is_new_validation_valid',
                        }),
                        question_option_id: Joi.number().required().messages({
                          'number.base':
                            'admin.patient_insurance_details_question_option_id_validation_required',
                          'any.required':
                            'admin.patient_insurance_details_question_option_id_validation_required',
                        }),
                      })
                    )
                    .min(1)
                    .unique((a, b) => a.option_value === b.option_value),
                  otherwise: Joi.optional(),
                })
                .messages({
                  'any.required':
                    'admin.patient_insurance_details_question_options_validation_required',
                  'array.min':
                    'admin.patient_insurance_details_question_options_validation_min_option',
                  'array.unique':
                    'admin.patient_insurance_details_question_options_validation_unique',
                }),
            })
          )
          .min(1)
          .messages({
            'any.required':
              'admin.patient_insurance_details_answers_validation_required',
            'array.min':
              'admin.patient_insurance_details_answers_validation_min_option',
            'array.unique':
              'admin.patient_insurance_details_answers_validation_unique',
          }),
      }),
    };
  }

  patientStatusUpdateValidation() {
    return {
      body: Joi.object({
        reason: Joi.string().required().min(3).max(255).messages({
          'string.empty': 'admin.patient_reason_validation_required',
          'any.required': 'admin.patient_reason_validation_required',
          'string.base': 'admin.patient_reason_validation_required',
          'string.min': 'admin.patient_reason_validation_min',
          'string.max': 'admin.patient_reason_validation_max',
        }),
      }),
    };
  }
}
module.exports = new PatientAuthValidator();
