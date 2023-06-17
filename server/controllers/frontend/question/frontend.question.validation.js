const { Joi } = require('express-validation');

class QuestionValidation {
  addQuestionValidation() {
    return {
      body: Joi.object({
        questions: Joi.array()
          .items(
            Joi.object().keys({
              question_id: Joi.number().required().messages({
                'any.required':
                  'admin.question_question_id_validation_required',
              }),
              label: Joi.string().required().min(1).max(255).messages({
                'string.empty': 'admin.question_label_validation_required',
                'any.required': 'admin.question_label_validation_required',
                'string.base': 'admin.question_label_validation_required',
                'string.min': 'admin.question_label_validation_min',
                'string.max': 'admin.question_label_validation_max',
              }),
              question_type: Joi.number()
                .required()
                .valid(1, 2, 3, 4, 5, 6)
                .messages({
                  'number.base':
                    'admin.question_question_type_validation_required',
                  'any.required':
                    'admin.question_question_type_validation_required',
                  'any.base.valid':
                    'admin.question_question_type_validation_valid',
                }),
              is_required: Joi.number().required().valid(1, 2).messages({
                'number.base': 'admin.question_is_required_validation_required',
                'any.required':
                  'admin.question_is_required_validation_required',
                'any.base.valid': 'admin.question_is_required_validation_valid',
              }),
              sequence: Joi.number()
                .integer()
                .max(999999)
                .min(0)
                .required()
                .messages({
                  'number.base': 'admin.question_sequence_validation_required',
                  'any.required': 'admin.question_sequence_validation_required',
                  'any.min': 'admin.question_sequence_validation_min',
                  'any.max': 'admin.question_sequence_validation_max',
                }),
              is_delete: Joi.number().required().valid(1, 2).messages({
                'number.base': 'admin.question_is_delete_validation_required',
                'any.required': 'admin.question_is_delete_validation_required',
                'any.base.valid': 'admin.question_is_delete_validation_valid',
              }),
              is_new: Joi.number().required().valid(1, 2).messages({
                'number.base': 'admin.question_is_new_validation_required',
                'any.required': 'admin.question_is_new_validation_required',
                'any.base.valid': 'admin.question_is_new_validation_valid',
              }),
              is_edit: Joi.number().required().valid(1, 2).messages({
                'number.base': 'admin.question_is_edit_validation_required',
                'any.required': 'admin.question_is_edit_validation_required',
                'any.base.valid': 'admin.question_is_edit_validation_valid',
              }),
              old_question_id: Joi.number().optional(),
              question_options: Joi.array()
                .when('question_type', {
                  is: [3, 4, 5],
                  then: Joi.array()
                    .items(
                      Joi.object().keys({
                        option_value: Joi.string().min(1).required().messages({
                          'string.empty':
                            'admin.question_question_options_validation_required',
                          'string.min':
                            'admin.question_question_options_validation_min',
                          'string.max':
                            'admin.question_question_options_validation_max',
                          'string.base':
                            'admin.question_question_options_validation_required',
                          'any.required':
                            'admin.question_question_options_validation_required',
                        }),
                        question_option_id: Joi.number().required().messages({
                          'number.base':
                            'admin.question_question_option_id_validation_required',
                          'any.required':
                            'admin.question_question_option_id_validation_required',
                        }),
                        is_delete: Joi.number()
                          .required()
                          .valid(1, 2)
                          .messages({
                            'number.base':
                              'admin.question_is_delete_validation_required',
                            'any.required':
                              'admin.question_is_delete_validation_required',
                            'any.base.valid':
                              'admin.question_is_delete_validation_valid',
                          }),
                        is_new: Joi.number().required().valid(1, 2).messages({
                          'number.base':
                            'admin.question_is_new_validation_required',
                          'any.required':
                            'admin.question_is_new_validation_required',
                          'any.base.valid':
                            'admin.question_is_new_validation_valid',
                        }),
                      })
                    )
                    .min(1)
                    .unique((a, b) => a.option_value === b.option_value),
                  otherwise: Joi.array().optional(),
                })
                .messages({
                  'any.required':
                    'admin.question_question_options_validation_required',
                  'array.min':
                    'admin.question_question_options_validation_min_option',
                  'array.unique':
                    'admin.question_question_options_validation_unique',
                }),
            })
          )
          .messages({
            'any.required':
              'admin.question_question_options_validation_required',
            'array.min':
              'admin.question_question_options_validation_min_option',
            'array.unique': 'admin.question_question_options_validation_unique',
          }),
      }),
    };
  }

  addBusinessQuestionsAns() {
    return {
      body: Joi.object({
        answers: Joi.array()
          .items(
            Joi.object().keys({
              user_question_ans_id: Joi.number().required().messages({
                'any.required':
                  'admin.business_question_user_question_ans_id_validation_required',
              }),
              question_id: Joi.number().required().messages({
                'any.required':
                  'admin.business_question_question_id_validation_required',
              }),
              is_required: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.business_question_is_required_validation_required',
                'any.required':
                  'admin.business_question_is_required_validation_required',
                'any.base.valid':
                  'admin.business_question_is_required_validation_valid',
              }),
              question_type: Joi.number()
                .required()
                .valid(1, 2, 3, 4, 5, 6)
                .messages({
                  'number.base':
                    'admin.business_question_question_type_validation_required',
                  'any.required':
                    'admin.business_question_question_type_validation_required',
                  'any.base.valid':
                    'admin.business_question_question_type_validation_valid',
                }),
              ans_value: Joi.when('question_type', {
                is: [1, 2, 6],
                then: Joi.when('is_requeired', {
                  is: 1,
                  then: Joi.string().required().min(1).messages({
                    'string.empty':
                      'admin.business_question_ans_value_validation_required',
                    'any.required':
                      'admin.business_question_ans_value_validation_required',
                    'string.base':
                      'admin.business_question_ans_value_validation_required',
                    'string.min':
                      'admin.business_question_ans_value_validation_min',
                    'string.max':
                      'admin.business_question_ans_value_validation_max',
                  }),
                  otherwise: Joi.optional(),
                }),
                otherwise: Joi.optional(),
              }),
              ans_type: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.business_question_ans_type_validation_required',
                'any.required':
                  'admin.business_question_ans_type_validation_required',
                'any.base.valid':
                  'admin.business_question_ans_type_validation_valid',
              }),
              question_text: Joi.string().required().min(1).messages({
                'string.empty':
                  'admin.business_question_question_text_validation_required',
                'any.required':
                  'admin.business_question_question_text_validation_required',
                'string.base':
                  'admin.business_question_question_text_validation_required',
                'string.min':
                  'admin.business_question_question_text_validation_min',
                'string.max':
                  'admin.business_question_question_text_validation_max',
              }),
              is_delete: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.business_question_is_delete_validation_required',
                'any.required':
                  'admin.business_question_is_delete_validation_required',
                'any.base.valid':
                  'admin.business_question_is_delete_validation_valid',
              }),
              is_new: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.business_question_is_new_validation_required',
                'any.required':
                  'admin.business_question_is_new_validation_required',
                'any.base.valid':
                  'admin.business_question_is_new_validation_valid',
              }),
              user_question_ans_option: Joi.array()
                .when('question_type', {
                  is: [3, 4, 5],
                  then: Joi.array()
                    .items(
                      Joi.object().keys({
                        option_value: Joi.string().min(1).required().messages({
                          'string.empty':
                            'admin.business_question_question_options_validation_required',
                          'string.min':
                            'admin.business_question_question_options_validation_min',
                          'string.max':
                            'admin.business_question_question_options_validation_max',
                          'string.base':
                            'admin.business_question_question_options_validation_required',
                          'any.required':
                            'admin.business_question_question_options_validation_required',
                        }),
                        user_question_ans_option_id: Joi.number()
                          .required()
                          .messages({
                            'number.base':
                              'admin.business_question_user_question_ans_option_id_validation_required',
                            'any.required':
                              'admin.business_question_user_question_ans_option_id_validation_required',
                          }),
                        is_delete: Joi.number()
                          .required()
                          .valid(1, 2)
                          .messages({
                            'number.base':
                              'admin.business_question_is_delete_validation_required',
                            'any.required':
                              'admin.business_question_is_delete_validation_required',
                            'any.base.valid':
                              'admin.business_question_is_delete_validation_valid',
                          }),
                        is_new: Joi.number().required().valid(1, 2).messages({
                          'number.base':
                            'admin.business_question_is_new_validation_required',
                          'any.required':
                            'admin.business_question_is_new_validation_required',
                          'any.base.valid':
                            'admin.business_question_is_new_validation_valid',
                        }),
                        question_option_id: Joi.number().required().messages({
                          'number.base':
                            'admin.business_question_question_option_id_validation_required',
                          'any.required':
                            'admin.business_question_question_option_id_validation_required',
                        }),
                      })
                    )
                    .min(1)
                    .unique((a, b) => a.option_value === b.option_value),
                  otherwise: Joi.optional(),
                })
                .messages({
                  'any.required':
                    'admin.business_question_question_options_validation_required',
                  'array.min':
                    'admin.business_question_question_options_validation_min_option',
                  'array.unique':
                    'admin.business_question_question_options_validation_unique',
                }),
            })
          )
          .min(1)
          .messages({
            'any.required':
              'admin.business_question_question_options_validation_required',
            'array.min':
              'admin.business_question_question_options_validation_min_option',
            'array.unique':
              'admin.business_question_question_options_validation_unique',
          }),
      }),
    };
  }

  addFormularyPatientQuestionsAns() {
    return {
      body: Joi.object({
        answers: Joi.array()
          .items(
            Joi.object().keys({
              user_question_ans_id: Joi.number().required().messages({
                'any.required':
                  'admin.formulary_patient_question_user_question_ans_id_validation_required',
              }),
              question_id: Joi.number().required().messages({
                'any.required':
                  'admin.formulary_patient_question_question_id_validation_required',
              }),
              order_id: Joi.number().required().messages({
                'any.required':
                  'admin.formulary_patient_question_order_id_validation_required',
              }),
              is_required: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.formulary_patient_question_is_required_validation_required',
                'any.required':
                  'admin.formulary_patient_question_is_required_validation_required',
                'any.base.valid':
                  'admin.formulary_patient_question_is_required_validation_valid',
              }),
              type: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.formulary_patient_question_type_validation_required',
                'any.required':
                  'admin.formulary_patient_question_type_validation_required',
                'any.base.valid':
                  'admin.formulary_patient_question_type_validation_valid',
              }),
              question_type: Joi.number()
                .required()
                .valid(1, 2, 3, 4, 5, 6)
                .messages({
                  'number.base':
                    'admin.formulary_patient_question_question_type_validation_required',
                  'any.required':
                    'admin.formulary_patient_question_question_type_validation_required',
                  'any.base.valid':
                    'admin.formulary_patient_question_question_type_validation_valid',
                }),
              ans_value: Joi.when('question_type', {
                is: [1, 2, 6],
                then: Joi.when('is_requeired', {
                  is: 1,
                  then: Joi.string().required().min(1).messages({
                    'string.empty':
                      'admin.formulary_patient_question_ans_value_validation_required',
                    'any.required':
                      'admin.formulary_patient_question_ans_value_validation_required',
                    'string.base':
                      'admin.formulary_patient_question_ans_value_validation_required',
                    'string.min':
                      'admin.formulary_patient_question_ans_value_validation_min',
                    'string.max':
                      'admin.formulary_patient_question_ans_value_validation_max',
                  }),
                  otherwise: Joi.optional(),
                }),
                otherwise: Joi.optional(),
              }),
              ans_type: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.formulary_patient_question_ans_type_validation_required',
                'any.required':
                  'admin.formulary_patient_question_ans_type_validation_required',
                'any.base.valid':
                  'admin.formulary_patient_question_ans_type_validation_valid',
              }),
              question_text: Joi.string().required().min(1).messages({
                'string.empty':
                  'admin.formulary_patient_question_question_text_validation_required',
                'any.required':
                  'admin.formulary_patient_question_question_text_validation_required',
                'string.base':
                  'admin.formulary_patient_question_question_text_validation_required',
                'string.min':
                  'admin.formulary_patient_question_question_text_validation_min',
              }),
              is_delete: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.formulary_patient_question_is_delete_validation_required',
                'any.required':
                  'admin.formulary_patient_question_is_delete_validation_required',
                'any.base.valid':
                  'admin.formulary_patient_question_is_delete_validation_valid',
              }),
              is_new: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.formulary_patient_question_is_new_validation_required',
                'any.required':
                  'admin.formulary_patient_question_is_new_validation_required',
                'any.base.valid':
                  'admin.formulary_patient_question_is_new_validation_valid',
              }),
              user_question_ans_option: Joi.array()
                .when('question_type', {
                  is: [3, 4, 5],
                  then: Joi.array()
                    .items(
                      Joi.object().keys({
                        option_value: Joi.string().min(1).required().messages({
                          'string.empty':
                            'admin.formulary_patient_question_question_options_validation_required',
                          'string.min':
                            'admin.formulary_patient_question_question_options_validation_min',
                          'string.max':
                            'admin.formulary_patient_question_question_options_validation_max',
                          'string.base':
                            'admin.formulary_patient_question_question_options_validation_required',
                          'any.required':
                            'admin.formulary_patient_question_question_options_validation_required',
                        }),
                        user_question_ans_option_id: Joi.number()
                          .required()
                          .messages({
                            'number.base':
                              'admin.formulary_patient_question_user_question_ans_option_id_validation_required',
                            'any.required':
                              'admin.formulary_patient_question_user_question_ans_option_id_validation_required',
                          }),
                        order_id: Joi.number().required().messages({
                          'any.required':
                            'admin.formulary_patient_question_order_id_validation_required',
                        }),
                        is_delete: Joi.number()
                          .required()
                          .valid(1, 2)
                          .messages({
                            'number.base':
                              'admin.formulary_patient_question_is_delete_validation_required',
                            'any.required':
                              'admin.formulary_patient_question_is_delete_validation_required',
                            'any.base.valid':
                              'admin.formulary_patient_question_is_delete_validation_valid',
                          }),
                        is_new: Joi.number().required().valid(1, 2).messages({
                          'number.base':
                            'admin.formulary_patient_question_is_new_validation_required',
                          'any.required':
                            'admin.formulary_patient_question_is_new_validation_required',
                          'any.base.valid':
                            'admin.formulary_patient_question_is_new_validation_valid',
                        }),
                        question_option_id: Joi.number().required().messages({
                          'number.base':
                            'admin.formulary_patient_question_question_option_id_validation_required',
                          'any.required':
                            'admin.formulary_patient_question_question_option_id_validation_required',
                        }),
                      })
                    )
                    .min(1)
                    .unique((a, b) => a.option_value === b.option_value),
                  otherwise: Joi.optional(),
                })
                .messages({
                  'any.required':
                    'admin.formulary_patient_question_question_options_validation_required',
                  'array.min':
                    'admin.formulary_patient_question_question_options_validation_min_option',
                  'array.unique':
                    'admin.formulary_patient_question_question_options_validation_unique',
                }),
            })
          )
          .min(1)
          .messages({
            'any.required':
              'admin.formulary_patient_question_question_options_validation_required',
            'array.min':
              'admin.formulary_patient_question_question_options_validation_min_option',
            'array.unique':
              'admin.formulary_patient_question_question_options_validation_unique',
          }),
      }),
    };
  }

  addCheckoutIntakePatientQuestionsAns() {
    return {
      body: Joi.object({
        confirmation_check: Joi.optional(),
        document_id: Joi.optional(),
        selfi_image: Joi.optional(),
        order_id: Joi.optional(),
        answers: Joi.array()
          .items(
            Joi.object().keys({
              user_question_ans_id: Joi.number().required().messages({
                'any.required':
                  'admin.checkout_intake_patient_question_user_question_ans_id_validation_required',
              }),
              question_id: Joi.number().required().messages({
                'any.required':
                  'admin.checkout_intake_patient_question_question_id_validation_required',
              }),
              order_id: Joi.number().required().messages({
                'any.required':
                  'admin.checkout_intake_patient_question_order_id_validation_required',
              }),
              is_required: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.checkout_intake_patient_question_is_required_validation_required',
                'any.required':
                  'admin.checkout_intake_patient_question_is_required_validation_required',
                'any.base.valid':
                  'admin.checkout_intake_patient_question_is_required_validation_valid',
              }),
              type: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.checkout_intake_patient_question_type_validation_required',
                'any.required':
                  'admin.checkout_intake_patient_question_type_validation_required',
                'any.base.valid':
                  'admin.checkout_intake_patient_question_type_validation_valid',
              }),
              question_type: Joi.number()
                .required()
                .valid(1, 2, 3, 4, 5, 6)
                .messages({
                  'number.base':
                    'admin.checkout_intake_patient_question_question_type_validation_required',
                  'any.required':
                    'admin.checkout_intake_patient_question_question_type_validation_required',
                  'any.base.valid':
                    'admin.checkout_intake_patient_question_question_type_validation_valid',
                }),
              ans_value: Joi.when('question_type', {
                is: [1, 2, 6],
                then: Joi.when('is_requeired', {
                  is: 1,
                  then: Joi.string().required().min(1).messages({
                    'string.empty':
                      'admin.checkout_intake_patient_question_ans_value_validation_required',
                    'any.required':
                      'admin.checkout_intake_patient_question_ans_value_validation_required',
                    'string.base':
                      'admin.checkout_intake_patient_question_ans_value_validation_required',
                    'string.min':
                      'admin.checkout_intake_patient_question_ans_value_validation_min',
                    'string.max':
                      'admin.checkout_intake_patient_question_ans_value_validation_max',
                  }),
                  otherwise: Joi.optional(),
                }),
                otherwise: Joi.optional(),
              }),
              ans_type: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.checkout_intake_patient_question_ans_type_validation_required',
                'any.required':
                  'admin.checkout_intake_patient_question_ans_type_validation_required',
                'any.base.valid':
                  'admin.checkout_intake_patient_question_ans_type_validation_valid',
              }),
              question_text: Joi.string().required().min(1).messages({
                'string.empty':
                  'admin.checkout_intake_patient_question_question_text_validation_required',
                'any.required':
                  'admin.checkout_intake_patient_question_question_text_validation_required',
                'string.base':
                  'admin.checkout_intake_patient_question_question_text_validation_required',
                'string.min':
                  'admin.checkout_intake_patient_question_question_text_validation_min',
              }),
              is_delete: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.checkout_intake_patient_question_is_delete_validation_required',
                'any.required':
                  'admin.checkout_intake_patient_question_is_delete_validation_required',
                'any.base.valid':
                  'admin.checkout_intake_patient_question_is_delete_validation_valid',
              }),
              is_new: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.checkout_intake_patient_question_is_new_validation_required',
                'any.required':
                  'admin.checkout_intake_patient_question_is_new_validation_required',
                'any.base.valid':
                  'admin.checkout_intake_patient_question_is_new_validation_valid',
              }),
              user_question_ans_option: Joi.array()
                .when('question_type', {
                  is: [3, 4, 5],
                  then: Joi.array()
                    .items(
                      Joi.object().keys({
                        option_value: Joi.string().min(1).required().messages({
                          'string.empty':
                            'admin.checkout_intake_patient_question_question_options_validation_required',
                          'string.min':
                            'admin.checkout_intake_patient_question_question_options_validation_min',
                          'string.base':
                            'admin.checkout_intake_patient_question_question_options_validation_required',
                          'any.required':
                            'admin.checkout_intake_patient_question_question_options_validation_required',
                        }),
                        user_question_ans_option_id: Joi.number()
                          .required()
                          .messages({
                            'number.base':
                              'admin.checkout_intake_patient_question_user_question_ans_option_id_validation_required',
                            'any.required':
                              'admin.checkout_intake_patient_question_user_question_ans_option_id_validation_required',
                          }),
                        order_id: Joi.number().required().messages({
                          'any.required':
                            'admin.checkout_intake_patient_question_order_id_validation_required',
                        }),
                        is_delete: Joi.number()
                          .required()
                          .valid(1, 2)
                          .messages({
                            'number.base':
                              'admin.checkout_intake_patient_question_is_delete_validation_required',
                            'any.required':
                              'admin.checkout_intake_patient_question_is_delete_validation_required',
                            'any.base.valid':
                              'admin.checkout_intake_patient_question_is_delete_validation_valid',
                          }),
                        is_new: Joi.number().required().valid(1, 2).messages({
                          'number.base':
                            'admin.checkout_intake_patient_question_is_new_validation_required',
                          'any.required':
                            'admin.checkout_intake_patient_question_is_new_validation_required',
                          'any.base.valid':
                            'admin.checkout_intake_patient_question_is_new_validation_valid',
                        }),
                        question_option_id: Joi.number().required().messages({
                          'number.base':
                            'admin.checkout_intake_patient_question_question_option_id_validation_required',
                          'any.required':
                            'admin.checkout_intake_patient_question_question_option_id_validation_required',
                        }),
                      })
                    )
                    .min(1)
                    .unique((a, b) => a.option_value === b.option_value),
                  otherwise: Joi.optional(),
                })
                .messages({
                  'any.required':
                    'admin.checkout_intake_patient_question_question_options_validation_required',
                  'array.min':
                    'admin.checkout_intake_patient_question_question_options_validation_min_option',
                  'array.unique':
                    'admin.checkout_intake_patient_question_question_options_validation_unique',
                }),
            })
          )
          // .min(1)
          .messages({
            'any.required':
              'admin.checkout_intake_patient_question_question_options_validation_required',
            'array.min':
              'admin.checkout_intake_patient_question_question_options_validation_min_option',
            'array.unique':
              'admin.checkout_intake_patient_question_question_options_validation_unique',
          }),
      }),
    };
  }

  addMadicationQuestionValidation() {
    return {
      body: Joi.object({
        questions: Joi.array()
          .items(
            Joi.object().keys({
              question_id: Joi.number().required().messages({
                'any.required':
                  'admin.question_question_id_validation_required',
              }),
              formulary_id: Joi.number().required().messages({
                'any.required':
                  'admin.question_formulary_id_validation_required',
              }),
              old_question_id: Joi.optional(),
              label: Joi.string().required().min(1).max(255).messages({
                'string.empty': 'admin.question_label_validation_required',
                'any.required': 'admin.question_label_validation_required',
                'string.base': 'admin.question_label_validation_required',
                'string.min': 'admin.question_label_validation_min',
                'string.max': 'admin.question_label_validation_max',
              }),
              question_type: Joi.number()
                .required()
                .valid(1, 2, 3, 4, 5, 6)
                .messages({
                  'number.base':
                    'admin.question_question_type_validation_required',
                  'any.required':
                    'admin.question_question_type_validation_required',
                  'any.base.valid':
                    'admin.question_question_type_validation_valid',
                }),
              is_required: Joi.number().required().valid(1, 2).messages({
                'number.base': 'admin.question_is_required_validation_required',
                'any.required':
                  'admin.question_is_required_validation_required',
                'any.base.valid': 'admin.question_is_required_validation_valid',
              }),
              sequence: Joi.number()
                .integer()
                .max(999999)
                .min(0)
                .required()
                .messages({
                  'number.base': 'admin.question_sequence_validation_required',
                  'any.required': 'admin.question_sequence_validation_required',
                  'any.min': 'admin.question_sequence_validation_min',
                  'any.max': 'admin.question_sequence_validation_max',
                }),
              is_delete: Joi.number().required().valid(1, 2).messages({
                'number.base': 'admin.question_is_delete_validation_required',
                'any.required': 'admin.question_is_delete_validation_required',
                'any.base.valid': 'admin.question_is_delete_validation_valid',
              }),
              is_new: Joi.number().required().valid(1, 2).messages({
                'number.base': 'admin.question_is_new_validation_required',
                'any.required': 'admin.question_is_new_validation_required',
                'any.base.valid': 'admin.question_is_new_validation_valid',
              }),
              is_edit: Joi.number().required().valid(1, 2).messages({
                'number.base': 'admin.question_is_edit_validation_required',
                'any.required': 'admin.question_is_edit_validation_required',
                'any.base.valid': 'admin.question_is_edit_validation_valid',
              }),
              question_options: Joi.array()
                .when('question_type', {
                  is: [3, 4, 5],
                  then: Joi.array()
                    .items(
                      Joi.object().keys({
                        option_value: Joi.string().min(1).required().messages({
                          'string.empty':
                            'admin.question_question_options_validation_required',
                          'string.min':
                            'admin.question_question_options_validation_min',
                          'string.max':
                            'admin.question_question_options_validation_max',
                          'string.base':
                            'admin.question_question_options_validation_required',
                          'any.required':
                            'admin.question_question_options_validation_required',
                        }),
                        question_option_id: Joi.number().required().messages({
                          'number.base':
                            'admin.question_question_option_id_validation_required',
                          'any.required':
                            'admin.question_question_option_id_validation_required',
                        }),
                        is_delete: Joi.number()
                          .required()
                          .valid(1, 2)
                          .messages({
                            'number.base':
                              'admin.question_is_delete_validation_required',
                            'any.required':
                              'admin.question_is_delete_validation_required',
                            'any.base.valid':
                              'admin.question_is_delete_validation_valid',
                          }),
                        is_new: Joi.number().required().valid(1, 2).messages({
                          'number.base':
                            'admin.question_is_new_validation_required',
                          'any.required':
                            'admin.question_is_new_validation_required',
                          'any.base.valid':
                            'admin.question_is_new_validation_valid',
                        }),
                      })
                    )
                    .min(1)
                    .unique((a, b) => a.option_value === b.option_value),
                  otherwise: Joi.optional(),
                })
                .messages({
                  'any.required':
                    'admin.question_question_options_validation_required',
                  'array.min':
                    'admin.question_question_options_validation_min_option',
                  'array.unique':
                    'admin.question_question_options_validation_unique',
                }),
            })
          )
          .min(1)
          .messages({
            'any.required':
              'admin.question_question_options_validation_required',
            'array.min':
              'admin.question_question_options_validation_min_option',
            'array.unique': 'admin.question_question_options_validation_unique',
          }),
      }),
    };
  }
}
module.exports = new QuestionValidation();
