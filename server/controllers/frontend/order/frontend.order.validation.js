const { Joi } = require('express-validation');

class OrderControllerValidation {
  storeOrganizationOrderNote() {
    return {
      body: Joi.object({
        order_id: Joi.number().required().messages({
          'any.required': 'admin.order_id_validation_required',
        }),
        note: Joi.string().required().messages({
          'string.empty': 'admin.order_note_validation_required',
          'any.required': 'admin.order_note_validation_required',
          'string.base': 'admin.order_note_validation_required',
        }),
        patient_id: Joi.number().required().messages({
          'any.required': 'admin.patient_id_validation_required',
        }),
      }),
    };
  }

  storeOrderChargeData() {
    return {
      body: Joi.object({
        order_id: Joi.number().required().messages({
          'any.required': 'admin.order_id_validation_required',
        }),
        card_id: Joi.number().required().messages({
          'any.required': 'admin.card_id_validation_required',
        }),
        order_item_id: Joi.number().required().messages({
          'any.required': 'admin.card_id_validation_required',
        }),
        transaction_id: Joi.optional(),
        amount: Joi.string()
          .pattern(/^\d{1,10}(\.\d{1,2})?$/)
          .required()
          .messages({
            'any.required': 'admin.amount_validation_required',
            'string.pattern.base': 'admin.amount_validation_required_pattern',
          }),
      }),
    };
  }

  pharmacyFillRequestStore() {
    return {
      body: Joi.object({
        order_id: Joi.number().min(1).required().messages({
          'any.required': 'admin.order_id_validation_required',
          'number.min': 'admin.order_id_validation_required',
        }),
        order_item_id: Joi.array()
          .min(1)
          .unique((a, b) => a === b)
          .messages({
            'any.required': 'admin.order_item_id_validation_required',
            'array.min': 'admin.order_item_id_validation_min',
            'array.unique': 'admin.order_item_id_validation_unique',
          }),
      }),
    };
  }
}
module.exports = new OrderControllerValidation();
