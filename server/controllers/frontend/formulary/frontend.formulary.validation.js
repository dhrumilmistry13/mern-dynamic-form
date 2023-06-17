const { Joi } = require('express-validation');

class OrganizationFormularyValidation {
  addFormularyValidation() {
    return {
      body: Joi.object({
        type: Joi.string().optional(),
        organization_formulary: Joi.array().items(
          Joi.object().keys({
            organization_formulary_id: Joi.number().required().messages({
              'any.required':
                'admin.organization_formulary_id_validation_required',
            }),
            formulary_id: Joi.number().required().messages({
              'any.required': 'admin.formulary_id_validation_required',
            }),
            margin: Joi.string()
              .pattern(/^\d{1,4}(\.\d{1,2})?$/)
              .required()
              .messages({
                'any.required':
                  'admin.organization_formulary_margin_validation_required',
                'string.pattern.base':
                  'admin.organization_formulary_margin_validation_required_pattern',
              }),
            patient_price: Joi.string()
              .pattern(/^\d{1,4}(\.\d{1,2})?$/)
              .required()
              .messages({
                'any.required':
                  'admin.organization_formulary_patient_price_validation_required',
                'string.pattern.base':
                  'admin.organization_formulary_patient_price_validation_required_pattern',
              }),
            popular_product: Joi.number().required().valid(1, 2).messages({
              'number.base':
                'admin.organization_formulary_popular_product_validation_required',
              'any.required':
                'admin.organization_formulary_popular_product_validation_required',
              'any.base.valid':
                'admin.organization_formulary_popular_product_validation_valid',
            }),
            top_discount_product: Joi.number().required().valid(1, 2).messages({
              'number.base':
                'admin.organization_formulary_top_discount_product_validation_required',
              'any.required':
                'admin.organization_formulary_top_discount_product_validation_required',
              'any.base.valid':
                'admin.organization_formulary_top_discount_product_validation_valid',
            }),
            prescription_product: Joi.number().required().valid(1, 2).messages({
              'number.base':
                'admin.organization_formulary_prescription_product_validation_required',
              'any.required':
                'admin.organization_formulary_prescription_product_validation_required',
              'any.base.valid':
                'admin.organization_formulary_prescription_product_validation_valid',
            }),
            is_delete: Joi.number().required().valid(1, 2).messages({
              'number.base':
                'admin.organization_formulary_is_delete_validation_required',
              'any.required':
                'admin.organization_formulary_is_delete_validation_required',
              'any.base.valid':
                'admin.organization_formulary_is_delete_validation_valid',
            }),
            is_new: Joi.number().required().valid(1, 2).messages({
              'number.base':
                'admin.organization_formulary_is_new_validation_required',
              'any.required':
                'admin.organization_formulary_is_new_validation_required',
              'any.base.valid':
                'admin.organization_formulary_is_new_validation_valid',
            }),
          })
        ),
      }),
    };
  }
}
module.exports = new OrganizationFormularyValidation();
