const { Joi } = require('express-validation');

class TransactionValidation {
  storeOrderTransactionDataValidation() {
    return {
      body: Joi.object({
        organization_id: Joi.any().optional().messages({
          'any.required':
            'admin.transaction_organization_id_validation_required',
        }),
        user_transaction_id: Joi.any().optional().messages({
          'any.required':
            'admin.transaction_user_transaction_id_validation_required',
        }),
        note: Joi.string().required().min(3).max(255).messages({
          'string.empty': 'admin.transaction_note_validation_required',
          'any.required': 'admin.transaction_note_validation_required',
          'string.base': 'admin.transaction_note_validation_required',
          'string.min': 'admin.transaction_note_validation_min',
          'string.max': 'admin.transaction_note_validation_max',
        }),
        type: Joi.string().required().valid('all', 'individual').messages({
          'any.required': 'admin.transaction_type_validation_required',
          'any.base.valid': 'admin.transaction_type_validation_valid',
        }),
        order_id: Joi.when('type', {
          is: 'individual',
          then: Joi.any().optional().messages({
            'any.required': 'admin.transaction_order_id_validation_required',
          }),
        }),
        from_date: Joi.optional(),
        to_date: Joi.optional(),
        page: Joi.optional(),
        payout_status: Joi.optional(),
      }),
    };
  }
}
module.exports = new TransactionValidation();
