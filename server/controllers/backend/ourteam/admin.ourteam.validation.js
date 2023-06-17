const { Joi } = require('express-validation');

class OurTeamValidation {
  addOurTeamValidation() {
    return {
      body: Joi.object({
        name: Joi.string().required().min(3).max(50).messages({
          'string.empty': 'admin.our_team_name_validation_required',
          'any.required': 'admin.our_team_name_validation_required',
          'string.base': 'admin.our_team_name_validation_required',
          'string.min': 'admin.our_team_name_validation_min',
          'string.max': 'admin.our_team_name_validation_max',
        }),
        designation: Joi.string().required().min(3).max(50).messages({
          'string.empty': 'admin.our_team_designation_validation_required',
          'any.required': 'admin.our_team_designation_validation_required',
          'string.base': 'admin.our_team_designation_validation_required',
          'string.min': 'admin.our_team_designation_validation_min',
          'string.max': 'admin.our_team_designation_validation_max',
        }),
        our_team_image: Joi.optional(),
        is_active: Joi.string().required().valid('1', '2').messages({
          'any.required': 'admin.our_team_is_active_validation_required',
          'any.base.valid': 'admin.our_team_is_active_validation_valid',
        }),
      }),
    };
  }

  editOurTeamValidation() {
    return {
      body: Joi.object({
        our_team_id: Joi.number().required().messages({
          'any.required': 'admin.our_team_our_team_id_validation_required',
        }),
        name: Joi.string().required().min(3).max(50).messages({
          'string.empty': 'admin.our_team_name_validation_required',
          'any.required': 'admin.our_team_name_validation_required',
          'string.base': 'admin.our_team_name_validation_required',
          'string.min': 'admin.our_team_name_validation_min',
          'string.max': 'admin.our_team_name_validation_max',
        }),
        designation: Joi.string().required().min(3).max(50).messages({
          'string.empty': 'admin.our_team_designation_validation_required',
          'any.required': 'admin.our_team_designation_validation_required',
          'string.base': 'admin.our_team_designation_validation_required',
          'string.min': 'admin.our_team_designation_validation_min',
          'string.max': 'admin.our_team_designation_validation_max',
        }),
        our_team_image: Joi.optional(),
        is_active: Joi.string().required().valid('1', '2').messages({
          'any.required': 'admin.our_team_is_active_validation_required',
          'any.valid': 'admin.our_team_is_active_validation_valid',
        }),
      }),
    };
  }
}
module.exports = new OurTeamValidation();
