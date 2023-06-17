const { Joi } = require('express-validation');

class QuestionValidation {
  addQuestionValidation() {
    return {
      body: Joi.object({
        label: Joi.string().required().min(1).max(255).messages({
          'string.empty': 'admin.question_label_validation_required',
          'any.required': 'admin.question_label_validation_required',
          'string.base': 'admin.question_label_validation_required',
          'string.min': 'admin.question_label_validation_min',
          'string.max': 'admin.question_label_validation_max',
        }),
        type: Joi.number().required().valid(1, 2, 3, 4, 5, 6).messages({
          'number.base': 'admin.question_type_validation_required',
          'any.required': 'admin.question_type_validation_required',
          'any.base.valid': 'admin.question_type_validation_valid',
        }),
        question_type: Joi.number()
          .required()
          .valid(1, 2, 3, 4, 5, 6, 7, 8)
          .messages({
            'number.base': 'admin.question_question_type_validation_required',
            'any.required': 'admin.question_question_type_validation_required',
            'any.base.valid': 'admin.question_question_type_validation_valid',
          }),
        is_required: Joi.number().required().valid(1, 2).messages({
          'number.base': 'admin.question_is_required_validation_required',
          'any.required': 'admin.question_is_required_validation_required',
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
        status: Joi.number().required().valid(1, 2).messages({
          'any.required': 'admin.question_status_validation_required',
          'any.valid': 'admin.question_status_validation_valid',
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
            'array.unique': 'admin.question_question_options_validation_unique',
          }),
      }),
    };
  }

  editQuestionValidation() {
    return {
      body: Joi.object({
        question_id: Joi.number().required().messages({
          'any.required': 'admin.question_question_id_validation_required',
        }),
        label: Joi.string().required().min(1).max(255).messages({
          'string.empty': 'admin.question_label_validation_required',
          'any.required': 'admin.question_label_validation_required',
          'string.base': 'admin.question_label_validation_required',
          'string.min': 'admin.question_label_validation_min',
          'string.max': 'admin.question_label_validation_max',
        }),
        type: Joi.number().required().valid(1, 2, 3, 4, 5, 6).messages({
          'number.base': 'admin.question_type_validation_required',
          'any.required': 'admin.question_type_validation_required',
          'any.base.valid': 'admin.question_type_validation_valid',
        }),
        question_type: Joi.number()
          .required()
          .valid(1, 2, 3, 4, 5, 6, 7, 8)
          .messages({
            'number.base': 'admin.question_question_type_validation_required',
            'any.required': 'admin.question_question_type_validation_required',
            'any.base.valid': 'admin.question_question_type_validation_valid',
          }),
        is_required: Joi.number().required().valid(1, 2).messages({
          'number.base': 'admin.question_is_required_validation_required',
          'any.required': 'admin.question_is_required_validation_required',
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
        status: Joi.number().required().valid(1, 2).messages({
          'any.required': 'admin.question_status_validation_required',
          'any.valid': 'admin.question_status_validation_valid',
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
                  is_delete: Joi.number().required().valid(1, 2).messages({
                    'number.base':
                      'admin.question_is_delete_validation_required',
                    'any.required':
                      'admin.question_is_delete_validation_required',
                    'any.base.valid':
                      'admin.question_is_delete_validation_valid',
                  }),
                  is_new: Joi.number().required().valid(1, 2).messages({
                    'number.base': 'admin.question_is_new_validation_required',
                    'any.required': 'admin.question_is_new_validation_required',
                    'any.base.valid': 'admin.question_is_new_validation_valid',
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
            'array.unique': 'admin.question_question_options_validation_unique',
          }),
      }),
    };
  }
}
module.exports = new QuestionValidation();
