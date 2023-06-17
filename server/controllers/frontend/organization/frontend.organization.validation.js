const { Joi } = require('express-validation');

class OrganizationValidator {
  organizationGeneralInfoStoreValidation() {
    return {
      body: Joi.object({
        company_name: Joi.string().max(155).trim(true).required().messages({
          'string.empty':
            'admin.organization_general_info_company_name_validation_required',
          'string.base':
            'admin.organization_general_info_company_name_validation_required',
          'string.max':
            'admin.organization_general_info_company_name_validation_max',
          'any.required':
            'admin.organization_general_info_company_name_validation_required',
        }),
        subdomain_name: Joi.string()
          .max(50)
          .pattern(/^[a-z0-9]+$/)
          .trim(true)
          .required()
          .messages({
            'string.empty':
              'admin.organization_general_info_subdomain_name_validation_required',
            'string.base':
              'admin.organization_general_info_subdomain_name_validation_required',
            'string.max':
              'admin.organization_general_info_subdomain_name_validation_max',
            'string.pattern.base':
              'admin.organization_general_info_subdomain_name_validation_pattern',
            'any.required':
              'admin.organization_general_info_subdomain_name_validation_required',
          }),
        state_ids: Joi.string().messages({
          'any.required':
            'admin.organization_general_info_state_ids_validation_required',
          'string.empty':
            'admin.organization_general_info_state_ids_validation_required',
          'array.base':
            'admin.organization_general_info_state_ids_validation_required',
        }),
        dob: Joi.string().required().trim(true).messages({
          'string.base':
            'admin.organization_general_info_dob_validation_required',
          'any.required':
            'admin.organization_general_info_dob_validation_required',
          'string.empty':
            'admin.organization_general_info_dob_validation_required',
        }),
        phone: Joi.optional(),
        country_id: Joi.optional(),
        npi_number: Joi.number().required().messages({
          'number.base':
            'admin.organization_general_info_npi_number_validation_required',
          'any.required':
            'admin.organization_general_info_npi_number_validation_required',
          'number.empty':
            'admin.organization_general_info_npi_number_validation_required',
        }),
        address: Joi.string().required().trim(true).messages({
          'string.base':
            'admin.organization_general_info_address_validation_required',
          'any.required':
            'admin.organization_general_info_address_validation_required',
          'string.empty':
            'admin.organization_general_info_address_validation_required',
        }),
        city: Joi.string().required().trim(true).messages({
          'string.base':
            'admin.organization_general_info_city_validation_required',
          'any.required':
            'admin.organization_general_info_city_validation_required',
          'string.empty':
            'admin.organization_general_info_city_validation_required',
        }),
        state: Joi.string().required().trim(true).messages({
          'string.base':
            'admin.organization_general_info_state_validation_required',
          'any.required':
            'admin.organization_general_info_state_validation_required',
          'string.empty':
            'admin.organization_general_info_state_validation_required',
        }),
        postcode: Joi.string().required().trim(true).messages({
          'string.base':
            'admin.organization_general_info_postcode_validation_required',
          'any.required':
            'admin.organization_general_info_postcode_validation_required',
          'string.empty':
            'admin.organization_general_info_postcode_validation_required',
        }),
        country: Joi.string().required().trim(true).messages({
          'string.base':
            'admin.organization_general_info_country_validation_required',
          'any.required':
            'admin.organization_general_info_country_validation_required',
          'string.empty':
            'admin.organization_general_info_country_validation_required',
        }),
        organization_specialities: Joi.array()
          .items(
            Joi.object().keys({
              name: Joi.optional(),
              is_checked: Joi.optional(),
              specialities_type: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organization_general_specialities_type_validation_required',
                'any.required':
                  'admin.organization_general_specialities_type_validation_required',
                'any.base.valid':
                  'admin.organization_general_specialities_type_validation_valid',
              }),
              is_delete: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organization_general_is_delete_validation_required',
                'any.required':
                  'admin.organization_general_is_delete_validation_required',
                'any.base.valid':
                  'admin.organization_general_is_delete_validation_valid',
              }),
              is_new: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organization_general_is_new_validation_required',
                'any.required':
                  'admin.organization_general_is_new_validation_required',
                'any.base.valid':
                  'admin.organization_general_is_new_validation_valid',
              }),
              typespecialities_other_text: Joi.when('specialities_type', {
                is: 2,
                then: Joi.when('is_delete', {
                  is: 1,
                  then: Joi.when('is_checked', {
                    is: 1,
                    then: Joi.string().min(3).max(50).required().messages({
                      'string.empty':
                        'admin.organization_general_typespecialities_other_text_validation_required',
                      'string.min':
                        'admin.organization_general_typespecialities_other_text_validation_min',
                      'string.max':
                        'admin.organization_general_typespecialities_other_text_validation_max',
                      'string.base':
                        'admin.organization_general_typespecialities_other_text_validation_required',
                      'any.required':
                        'admin.organization_general_typespecialities_other_text_validation_required',
                    }),
                  }),
                  otherwise: Joi.optional(),
                }),
                otherwise: Joi.optional(),
              }),
              specialities_id: Joi.when('specialities_type', {
                is: 1,
                then: Joi.number().required().messages({
                  'number.empty':
                    'admin.organization_general_specialities_id_validation_required',
                  'number.base':
                    'admin.organization_general_specialities_id_validation_required',
                  'any.required':
                    'admin.organization_general_specialities_id_validation_required',
                }),
                otherwise: Joi.optional(),
              }),
              organization_specialities_id: Joi.number().required().messages({
                'number.base':
                  'admin.organization_general_organization_specialities_id_validation_required',
                'any.required':
                  'admin.organization_general_organization_specialities_id_validation_required',
              }),
            })
          )
          .min(1),
      }),
    };
  }

  organizationBrandInfoStoreValidation() {
    return {
      body: Joi.object({
        header_logo: Joi.string().trim(true).required().messages({
          'string.empty':
            'admin.organization_general_info_header_logo_validation_required',
          'string.base':
            'admin.organization_general_info_header_logo_validation_required',
          'string.max':
            'admin.organization_general_info_header_logo_validation_max',
          'any.required':
            'admin.organization_general_info_header_logo_validation_required',
        }),
        footer_logo: Joi.string().trim(true).required().messages({
          'string.empty':
            'admin.organization_general_info_footer_logo_validation_required',
          'string.base':
            'admin.organization_general_info_footer_logo_validation_required',
          'string.max':
            'admin.organization_general_info_footer_logo_validation_max',
          'any.required':
            'admin.organization_general_info_footer_logo_validation_required',
        }),
        menu_text_color: Joi.string().messages({
          'any.required':
            'admin.organization_general_info_menu_text_color_validation_required',
          'string.empty':
            'admin.organization_general_info_menu_text_color_validation_required',
          'array.base':
            'admin.organization_general_info_menu_text_color_validation_required',
        }),
        button_icon_color: Joi.string().messages({
          'any.required':
            'admin.organization_general_info_button_icon_color_validation_required',
          'string.empty':
            'admin.organization_general_info_button_icon_color_validation_required',
          'array.base':
            'admin.organization_general_info_button_icon_color_validation_required',
        }),
        heading_color: Joi.string().messages({
          'any.required':
            'admin.organization_general_info_heading_color_validation_required',
          'string.empty':
            'admin.organization_general_info_heading_color_validation_required',
          'array.base':
            'admin.organization_general_info_heading_color_validation_required',
        }),
        text_color: Joi.string().messages({
          'any.required':
            'admin.organization_general_info_text_color_validation_required',
          'string.empty':
            'admin.organization_general_info_text_color_validation_required',
          'array.base':
            'admin.organization_general_info_text_color_validation_required',
        }),
        background_color: Joi.string().messages({
          'any.required':
            'admin.organization_general_info_background_color_validation_required',
          'string.empty':
            'admin.organization_general_info_background_color_validation_required',
          'array.base':
            'admin.organization_general_info_background_color_validation_required',
        }),
        primary_color: Joi.string().messages({
          'any.required':
            'admin.organization_general_info_primary_color_validation_required',
          'string.empty':
            'admin.organization_general_info_primary_color_validation_required',
          'array.base':
            'admin.organization_general_info_primary_color_validation_required',
        }),
        banner_text_color: Joi.string().messages({
          'any.required':
            'admin.organization_general_info_banner_text_color_validation_required',
          'string.empty':
            'admin.organization_general_info_banner_text_color_validation_required',
          'array.base':
            'admin.organization_general_info_banner_text_color_validation_required',
        }),
        btn_icon_color: Joi.string().messages({
          'any.required':
            'admin.organization_general_info_btn_icon_color_validation_required',
          'string.empty':
            'admin.organization_general_info_btn_icon_color_validation_required',
          'array.base':
            'admin.organization_general_info_btn_icon_color_validation_required',
        }),
      }),
    };
  }
}
module.exports = new OrganizationValidator();
