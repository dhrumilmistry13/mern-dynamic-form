const { Joi } = require('express-validation');

class CartControllerValidation {
  storeFormularyDetailsValidation() {
    return {
      body: Joi.object({
        formulary_id: Joi.number().required().messages({
          'any.required': 'admin.formulary_id_validation_required',
        }),
        qty: Joi.number().required().messages({
          'number.base': 'admin.qty_validation_required',
          'any.required': 'admin.qty_validation_required',
        }),
        price: Joi.string()
          .pattern(/^\d{1,8}(\.\d{1,2})?$/)
          .required()
          .messages({
            'any.required': 'admin.price_validation_required',
            'string.pattern.base': 'admin.price_validation_required_pattern',
          }),
        sub_total: Joi.string()
          .pattern(/^\d{1,8}(\.\d{1,2})?$/)
          .required()
          .messages({
            'any.required': 'admin.sub_total_validation_required',
            'string.pattern.base':
              'admin.sub_total_validation_required_pattern',
          }),
        medication_cost: Joi.string()
          .pattern(/^\d{1,8}(\.\d{1,2})?$/)
          .required()
          .messages({
            'any.required': 'admin.medication_cost_validation_required',
            'string.pattern.base':
              'admin.medication_cost_validation_required_pattern',
          }),
        packing_shipping_fee: Joi.optional(),
        is_new: Joi.number().required().valid(1, 2).messages({
          'number.base': 'admin.is_new_validation_required',
          'any.required': 'admin.is_new_validation_required',
          'any.base.valid': 'admin.is_new_validation_valid',
        }),
      }),
    };
  }

  storeOrderAddressDataValidation() {
    return {
      body: Joi.object({
        order_note: Joi.optional(),
        order_id: Joi.optional(),
        card_data: Joi.optional(),
        first_name: Joi.string().max(100).trim(true).required().messages({
          'string.empty':
            'admin.patient_order_address_first_name_validation_required',
          'string.base':
            'admin.patient_order_address_first_name_validation_required',
          'string.max': 'admin.patient_order_address_first_name_validation_max',
          'any.required':
            'admin.patient_order_address_first_name_validation_required',
        }),
        last_name: Joi.string()
          .max(100)
          .trim(true)
          .required()
          .label('Last Name')
          .messages({
            'string.empty':
              'admin.patient_order_address_last_name_validation_required',
            'string.base':
              'admin.patient_order_address_last_name_validation_required',
            'string.max':
              'admin.patient_order_address_last_name_validation_max',
            'any.required':
              'admin.patient_order_address_last_name_validation_required',
          }),
        email: Joi.string()
          .max(150)
          .email()
          .trim(true)
          .required()
          .label('Email')
          .messages({
            'string.empty':
              'admin.patient_order_address_email_validation_required',
            'string.base':
              'admin.patient_order_address_email_validation_required',
            'string.max': 'admin.patient_order_address_email_validation_max',
            'string.email':
              'admin.patient_order_address_email_validation_valid',
            'any.required':
              'admin.patient_order_address_email_validation_required',
          }),
        phone: Joi.string().required().max(10).trim(true).messages({
          'string.base':
            'admin.patient_order_address_phone_validation_required',
          'string.max': 'admin.patient_order_address_phone_validation_max',
          'any.required':
            'admin.patient_order_address_phone_validation_required',
          'string.empty':
            'admin.patient_order_address_phone_validation_required',
        }),
        country_id: Joi.number().required().messages({
          'string.base':
            'admin.patient_order_address_country_id_validation_required',
          'any.required':
            'admin.patient_order_address_country_id_validation_required',
          'string.empty':
            'admin.patient_order_address_country_id_validation_required',
        }),
        address: Joi.string().trim(true).required().messages({
          'string.empty':
            'admin.patient_order_address_address_validation_required',
          'string.base':
            'admin.patient_order_address_address_validation_required',
          'any.required':
            'admin.patient_order_address_address_validation_required',
        }),
        city: Joi.string().max(30).trim(true).required().messages({
          'string.empty':
            'admin.patient_order_address_city_validation_required',
          'string.base': 'admin.patient_order_address_city_validation_required',
          'string.max': 'admin.patient_order_address_city_validation_max',
          'any.required':
            'admin.patient_order_address_city_validation_required',
        }),
        state_id: Joi.number().required().messages({
          'string.base':
            'admin.patient_order_address_state_id_validation_required',
          'any.required':
            'admin.patient_order_address_state_id_validation_required',
          'string.empty':
            'admin.patient_order_address_state_id_validation_required',
        }),
        zipcode: Joi.string().max(30).trim(true).required().messages({
          'string.empty':
            'admin.patient_order_address_zipcode_validation_required',
          'string.base':
            'admin.patient_order_address_zipcode_validation_required',
          'string.max': 'admin.patient_order_address_zipcode_validation_max',
          'any.required':
            'admin.patient_order_address_zipcode_validation_required',
        }),
        is_billing_same: Joi.number().valid(1, 2).messages({
          'number.base':
            'admin.patient_order_address_is_billing_same_validation_required',
          'any.required':
            'admin.patient_order_address_is_billing_same_validation_required',
          'any.base.valid':
            'admin.patient_order_address_is_billing_same_validation_valid',
        }),

        b_first_name: Joi.when('is_billing_same', {
          is: 2,
          then: Joi.string().max(100).trim(true).required().messages({
            'string.empty':
              'admin.patient_order_address_first_name_validation_required',
            'string.base':
              'admin.patient_order_address_first_name_validation_required',
            'string.max':
              'admin.patient_order_address_first_name_validation_max',
            'any.required':
              'admin.patient_order_address_first_name_validation_required',
          }),
          otherwise: Joi.optional(),
        }),
        b_last_name: Joi.when('is_billing_same', {
          is: 2,
          then: Joi.string()
            .max(100)
            .trim(true)
            .required()
            .label('Last Name')
            .messages({
              'string.empty':
                'admin.patient_order_address_last_name_validation_required',
              'string.base':
                'admin.patient_order_address_last_name_validation_required',
              'string.max':
                'admin.patient_order_address_last_name_validation_max',
              'any.required':
                'admin.patient_order_address_last_name_validation_required',
            }),
          otherwise: Joi.optional(),
        }),
        b_email: Joi.when('is_billing_same', {
          is: 2,
          then: Joi.string()
            .max(150)
            .email()
            .trim(true)
            .required()
            .label('Email')
            .messages({
              'string.empty':
                'admin.patient_order_address_email_validation_required',
              'string.base':
                'admin.patient_order_address_email_validation_required',
              'string.max': 'admin.patient_order_address_email_validation_max',
              'string.email':
                'admin.patient_order_address_email_validation_valid',
              'any.required':
                'admin.patient_order_address_email_validation_required',
            }),
          otherwise: Joi.optional(),
        }),
        b_phone: Joi.when('is_billing_same', {
          is: 2,
          then: Joi.string().required().max(10).trim(true).messages({
            'string.base':
              'admin.patient_order_address_phone_validation_required',
            'string.max': 'admin.patient_order_address_phone_validation_max',
            'any.required':
              'admin.patient_order_address_phone_validation_required',
            'string.empty':
              'admin.patient_order_address_phone_validation_required',
          }),
          otherwise: Joi.optional(),
        }),
        b_country_id: Joi.when('is_billing_same', {
          is: 2,
          then: Joi.number().required().messages({
            'string.base':
              'admin.patient_order_address_country_id_validation_required',
            'any.required':
              'admin.patient_order_address_country_id_validation_required',
            'string.empty':
              'admin.patient_order_address_country_id_validation_required',
          }),
          otherwise: Joi.optional(),
        }),
        b_address: Joi.when('is_billing_same', {
          is: 2,
          then: Joi.string().trim(true).required().messages({
            'string.empty':
              'admin.patient_order_address_address_validation_required',
            'string.base':
              'admin.patient_order_address_address_validation_required',
            'any.required':
              'admin.patient_order_address_address_validation_required',
          }),
          otherwise: Joi.optional(),
        }),
        b_city: Joi.when('is_billing_same', {
          is: 2,
          then: Joi.string().max(30).trim(true).required().messages({
            'string.empty':
              'admin.patient_order_address_city_validation_required',
            'string.base':
              'admin.patient_order_address_city_validation_required',
            'string.max': 'admin.patient_order_address_city_validation_max',
            'any.required':
              'admin.patient_order_address_city_validation_required',
          }),
          otherwise: Joi.optional(),
        }),
        b_state_id: Joi.when('is_billing_same', {
          is: 2,
          then: Joi.number().required().messages({
            'string.base':
              'admin.patient_order_address_state_id_validation_required',
            'any.required':
              'admin.patient_order_address_state_id_validation_required',
            'string.empty':
              'admin.patient_order_address_state_id_validation_required',
          }),
          otherwise: Joi.optional(),
        }),
        b_zipcode: Joi.when('is_billing_same', {
          is: 2,
          then: Joi.string().max(30).trim(true).required().messages({
            'string.empty':
              'admin.patient_order_address_zipcode_validation_required',
            'string.base':
              'admin.patient_order_address_zipcode_validation_required',
            'string.max': 'admin.patient_order_address_zipcode_validation_max',
            'any.required':
              'admin.patient_order_address_zipcode_validation_required',
          }),
          otherwise: Joi.optional(),
        }),
      }),
    };
  }
}
module.exports = new CartControllerValidation();
