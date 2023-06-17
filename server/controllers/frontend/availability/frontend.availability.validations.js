const { Joi } = require('express-validation');
const moment = require('moment');

const isSameOrBefore = (startTime, endTime) =>
  moment(startTime, 'HH:mm').isBefore(moment(endTime, 'HH:mm'));

const isSameOrAfter = (startTime, endTime) =>
  moment(startTime, 'HH:mm').isAfter(moment(endTime, 'HH:mm'));

class AvailabilityValidations {
  addAvailabilty() {
    return {
      body: Joi.object({
        is_date_range: Joi.number().required().messages({
          'string.empty':
            'admin.organization_availability_is_date_range_validation_required',
          'any.required':
            'admin.organization_availability_is_date_range_validation_required',
        }),
        start_date: Joi.when('is_date_range', {
          is: 2,
          then: Joi.date().required().messages({
            'string.empty':
              'admin.organization_availability_start_date_validation_required',
            'string.base':
              'admin.organization_availability_start_date_validation_required',
            'any.required':
              'admin.organization_availability_start_date_validation_required',
          }),
          otherwise: Joi.optional(),
        }),
        end_date: Joi.when('is_date_range', {
          is: 2,
          then: Joi.string().required().messages({
            'string.empty':
              'admin.organization_availability_end_date_validation_required',
            'string.base':
              'admin.organization_availability_end_date_validation_required',
            'any.required':
              'admin.organization_availability_end_date_validation_required',
          }),
          otherwise: Joi.optional(),
        }),
        days_slot_1: Joi.array()
          .items(
            Joi.object().keys({
              org_slot_id: Joi.optional(),
              is_closed: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organisation_available_days_slot_1_is_closed_validation_required',
                'any.required':
                  'admin.organisation_available_days_slot_1_is_closed_validation_required',
                'any.base.valid':
                  'admin.organisation_available_days_slot_1_is_closed_validation_valid',
              }),
              is_new: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organisation_available_days_slot_1_is_new_validation_required',
                'any.required':
                  'admin.organisation_available_days_slot_1_is_new_validation_required',
                'any.base.valid':
                  'admin.organisation_available_days_slot_1_is_new_validation_valid',
              }),
              is_delete: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organisation_available_days_slot_1_is_delete_validation_required',
                'any.required':
                  'admin.organisation_available_days_slot_1_is_delete_validation_required',
                'any.base.valid':
                  'admin.organisation_available_days_slot_1_is_delete_validation_valid',
              }),
              start_time: Joi.when('is_closed', {
                is: 1,
                then: Joi.string()
                  .regex(/^([0-9]{2}):([0-9]{2})$/)
                  .required()
                  .custom((value, { state, message }) => {
                    const path = state.path[1];
                    const data = state.ancestors[1];
                    const endTime = data[path].end_time;
                    const { is_delete } = data[path];
                    const same_time_check = data.filter(
                      (v) => v.start_time === value && v.is_delete === 1
                    );
                    let cntStart = path;
                    const valueTime = value;
                    if (
                      isSameOrBefore(value, endTime) === false &&
                      is_delete === 1
                    ) {
                      return message(
                        'admin.organisation_available_days_slot_1_enter_valid_start_time'
                      );
                    }
                    if (same_time_check.length >= 2 && is_delete === 1) {
                      return message(
                        'admin.organisation_available_days_slot_1_start_time_already_exits'
                      );
                    }
                    data.forEach((value1) => {
                      if (
                        valueTime < value1.start_time &&
                        value1.is_delete === 1
                      ) {
                        cntStart += 1;
                      }
                    });

                    if (
                      cntStart !== 0 &&
                      cntStart < same_time_check.length - 1 &&
                      is_delete === 1
                    ) {
                      return message(
                        'admin.organisation_available_days_slot_1_enter_valid_start_time_already_exits'
                      );
                    }
                    return true;
                  }),
                otherwise: Joi.optional(),
              }),
              end_time: Joi.when('is_closed', {
                is: 1,
                then: Joi.string()
                  .regex(/^([0-9]{2}):([0-9]{2})$/)
                  .required()
                  .custom((value, { state, message }) => {
                    const path = state.path[1];
                    const data = state.ancestors[1];
                    const { is_delete } = data[path];
                    const startTime = data[path].start_time;
                    const same_time_check = data.filter(
                      (v) => v.end_time === value && v.is_delete === 1
                    );
                    let cntStart = path;
                    const valueTime = value;
                    if (
                      isSameOrAfter(value, startTime) === false &&
                      is_delete === 1
                    ) {
                      return message(
                        'admin.organisation_available_days_slot_1_enter_valid_end_time'
                      );
                    }
                    if (same_time_check.length >= 2 && is_delete === 1) {
                      return message(
                        'admin.organisation_available_days_slot_1_end_time_already_exits'
                      );
                    }
                    data.forEach((value1) => {
                      if (
                        valueTime < value1.end_time &&
                        value1.is_delete === 1
                      ) {
                        cntStart += 1;
                      }
                    });

                    if (
                      cntStart !== 0 &&
                      cntStart < same_time_check.length - 1 &&
                      is_delete === 1
                    ) {
                      return message(
                        'admin.organisation_available_days_slot_1_enter_valid_end_time_already_exits'
                      );
                    }
                    return true;
                  }),
                otherwise: Joi.optional(),
              }),
            })
          )
          .min(1),
        days_slot_2: Joi.array()
          .items(
            Joi.object().keys({
              org_slot_id: Joi.optional(),
              is_closed: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organisation_available_days_slot_2_is_closed_validation_required',
                'any.required':
                  'admin.organisation_available_days_slot_2_is_closed_validation_required',
                'any.base.valid':
                  'admin.organisation_available_days_slot_2_is_closed_validation_valid',
              }),
              is_new: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organisation_available_days_slot_2_is_new_validation_required',
                'any.required':
                  'admin.organisation_available_days_slot_2_is_new_validation_required',
                'any.base.valid':
                  'admin.organisation_available_days_slot_2_is_new_validation_valid',
              }),
              is_delete: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organisation_available_days_slot_2_is_delete_validation_required',
                'any.required':
                  'admin.organisation_available_days_slot_2_is_delete_validation_required',
                'any.base.valid':
                  'admin.organisation_available_days_slot_2_is_delete_validation_valid',
              }),
              start_time: Joi.when('is_closed', {
                is: 1,
                then: Joi.string()
                  .regex(/^([0-9]{2}):([0-9]{2})$/)
                  .required()
                  .custom((value, { state, message }) => {
                    const path = state.path[1];
                    const data = state.ancestors[1];
                    const { is_delete } = data[path];
                    const endTime = data[path].end_time;
                    const same_time_check = data.filter(
                      (v) => v.start_time === value && v.is_delete === 1
                    );
                    let cntStart = path;
                    const valueTime = value;
                    if (
                      isSameOrBefore(value, endTime) === false &&
                      is_delete === 1
                    ) {
                      return message(
                        'admin.organisation_available_days_slot_2_enter_valid_start_time'
                      );
                    }
                    if (same_time_check.length >= 2 && is_delete === 1) {
                      return message(
                        'admin.organisation_available_days_slot_2_start_time_already_exits'
                      );
                    }
                    data.forEach((value1) => {
                      if (
                        valueTime < value1.start_time &&
                        value1.is_delete === 1
                      ) {
                        cntStart += 1;
                      }
                    });

                    if (
                      cntStart !== 0 &&
                      cntStart < same_time_check.length - 1 &&
                      is_delete === 1
                    ) {
                      return message(
                        'admin.organisation_available_days_slot_2_enter_valid_start_time_already_exits'
                      );
                    }
                    return true;
                  }),
                otherwise: Joi.optional(),
              }),
              end_time: Joi.when('is_closed', {
                is: 1,
                then: Joi.string()
                  .regex(/^([0-9]{2}):([0-9]{2})$/)
                  .required()
                  .custom((value, { state, message }) => {
                    const path = state.path[1];
                    const data = state.ancestors[1];
                    const { is_delete } = data[path];
                    const startTime = data[path].start_time;
                    const same_time_check = data.filter(
                      (v) => v.end_time === value && v.is_delete === 1
                    );
                    let cntStart = path;
                    const valueTime = value;
                    if (
                      isSameOrAfter(value, startTime) === false &&
                      is_delete === 1
                    ) {
                      return message(
                        'admin.organisation_available_days_slot_2_enter_valid_end_time'
                      );
                    }
                    if (same_time_check.length >= 2 && is_delete === 1) {
                      return message(
                        'admin.organisation_available_days_slot_2_end_time_already_exits'
                      );
                    }
                    data.forEach((value1) => {
                      if (
                        valueTime < value1.end_time &&
                        value1.is_delete === 1
                      ) {
                        cntStart += 1;
                      }
                    });

                    if (
                      cntStart !== 0 &&
                      cntStart < same_time_check.length - 1 &&
                      is_delete === 1
                    ) {
                      return message(
                        'admin.organisation_available_days_slot_2_enter_valid_end_time_already_exits'
                      );
                    }
                    return true;
                  }),
                otherwise: Joi.optional(),
              }),
            })
          )
          .min(1),
        days_slot_3: Joi.array()
          .items(
            Joi.object().keys({
              org_slot_id: Joi.optional(),
              is_closed: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organisation_available_days_slot_3_is_closed_validation_required',
                'any.required':
                  'admin.organisation_available_days_slot_3_is_closed_validation_required',
                'any.base.valid':
                  'admin.organisation_available_days_slot_3_is_closed_validation_valid',
              }),
              is_new: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organisation_available_days_slot_3_is_new_validation_required',
                'any.required':
                  'admin.organisation_available_days_slot_3_is_new_validation_required',
                'any.base.valid':
                  'admin.organisation_available_days_slot_3_is_new_validation_valid',
              }),
              is_delete: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organisation_available_days_slot_3_is_delete_validation_required',
                'any.required':
                  'admin.organisation_available_days_slot_3_is_delete_validation_required',
                'any.base.valid':
                  'admin.organisation_available_days_slot_3_is_delete_validation_valid',
              }),
              start_time: Joi.when('is_closed', {
                is: 1,
                then: Joi.string()
                  .regex(/^([0-9]{2}):([0-9]{2})$/)
                  .required()
                  .custom((value, { state, message }) => {
                    const path = state.path[1];
                    const data = state.ancestors[1];
                    const { is_delete } = data[path];
                    const endTime = data[path].end_time;
                    const same_time_check = data.filter(
                      (v) => v.start_time === value && v.is_delete === 1
                    );
                    let cntStart = path;
                    const valueTime = value;
                    if (
                      isSameOrBefore(value, endTime) === false &&
                      is_delete === 1
                    ) {
                      return message(
                        'admin.organisation_available_days_slot_3_enter_valid_start_time'
                      );
                    }
                    if (same_time_check.length >= 2 && is_delete === 1) {
                      return message(
                        'admin.organisation_available_days_slot_3_start_time_already_exits'
                      );
                    }
                    data.forEach((value1) => {
                      if (
                        valueTime < value1.start_time &&
                        value1.is_delete === 1
                      ) {
                        cntStart += 1;
                      }
                    });

                    if (
                      cntStart !== 0 &&
                      cntStart < same_time_check.length - 1 &&
                      is_delete === 1
                    ) {
                      return message(
                        'admin.organisation_available_days_slot_3_enter_valid_start_time_already_exits'
                      );
                    }
                    return true;
                  }),
                otherwise: Joi.optional(),
              }),
              end_time: Joi.when('is_closed', {
                is: 1,
                then: Joi.string()
                  .regex(/^([0-9]{2}):([0-9]{2})$/)
                  .required()
                  .custom((value, { state, message }) => {
                    const path = state.path[1];
                    const data = state.ancestors[1];
                    const { is_delete } = data[path];
                    const startTime = data[path].start_time;
                    const same_time_check = data.filter(
                      (v) => v.end_time === value && v.is_delete === 1
                    );
                    let cntStart = path;
                    const valueTime = value;
                    if (
                      isSameOrAfter(value, startTime) === false &&
                      is_delete === 1
                    ) {
                      return message(
                        'admin.organisation_available_days_slot_3_enter_valid_end_time'
                      );
                    }
                    if (same_time_check.length >= 2 && is_delete === 1) {
                      return message(
                        'admin.organisation_available_days_slot_3_end_time_already_exits'
                      );
                    }
                    data.forEach((value1) => {
                      if (
                        valueTime < value1.end_time &&
                        value1.is_delete === 1
                      ) {
                        cntStart += 1;
                      }
                    });

                    if (
                      cntStart !== 0 &&
                      cntStart < same_time_check.length - 1 &&
                      is_delete === 1
                    ) {
                      return message(
                        `admin.organisation_available_days_slot_3_enter_valid_end_time_already_exits`
                      );
                    }
                    return true;
                  }),
                otherwise: Joi.optional(),
              }),
            })
          )
          .min(1),
        days_slot_4: Joi.array()
          .items(
            Joi.object().keys({
              org_slot_id: Joi.optional(),
              is_closed: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organisation_available_days_slot_4_is_closed_validation_required',
                'any.required':
                  'admin.organisation_available_days_slot_4_is_closed_validation_required',
                'any.base.valid':
                  'admin.organisation_available_days_slot_4_is_closed_validation_valid',
              }),
              is_new: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organisation_available_days_slot_4_is_new_validation_required',
                'any.required':
                  'admin.organisation_available_days_slot_4_is_new_validation_required',
                'any.base.valid':
                  'admin.organisation_available_days_slot_4_is_new_validation_valid',
              }),
              is_delete: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organisation_available_days_slot_4_is_delete_validation_required',
                'any.required':
                  'admin.organisation_available_days_slot_4_is_delete_validation_required',
                'any.base.valid':
                  'admin.organisation_available_days_slot_4_is_delete_validation_valid',
              }),
              start_time: Joi.when('is_closed', {
                is: 1,
                then: Joi.string()
                  .regex(/^([0-9]{2}):([0-9]{2})$/)
                  .required()
                  .custom((value, { state, message }) => {
                    const path = state.path[1];
                    const data = state.ancestors[1];
                    const { is_delete } = data[path];
                    const endTime = data[path].end_time;
                    const same_time_check = data.filter(
                      (v) => v.start_time === value && v.is_delete === 1
                    );
                    let cntStart = path;
                    const valueTime = value;
                    if (
                      isSameOrBefore(value, endTime) === false &&
                      is_delete === 1
                    ) {
                      return message(
                        'admin.organisation_available_days_slot_4_enter_valid_start_time'
                      );
                    }
                    if (same_time_check.length >= 2 && is_delete === 1) {
                      return message(
                        'admin.organisation_available_days_slot_4_start_time_already_exits'
                      );
                    }
                    data.forEach((value1) => {
                      if (
                        valueTime < value1.start_time &&
                        value1.is_delete === 1
                      ) {
                        cntStart += 1;
                      }
                    });

                    if (
                      cntStart !== 0 &&
                      cntStart < same_time_check.length - 1 &&
                      is_delete === 1
                    ) {
                      return message(
                        `admin.organisation_available_days_slot_4_enter_valid_start_time_already_exits`
                      );
                    }
                    return true;
                  }),
                otherwise: Joi.optional(),
              }),
              end_time: Joi.when('is_closed', {
                is: 1,
                then: Joi.string()
                  .regex(/^([0-9]{2}):([0-9]{2})$/)
                  .required()
                  .custom((value, { state, message }) => {
                    const path = state.path[1];
                    const data = state.ancestors[1];
                    const { is_delete } = data[path];
                    const startTime = data[path].start_time;
                    const same_time_check = data.filter(
                      (v) => v.end_time === value && v.is_delete === 1
                    );
                    let cntStart = path;
                    const valueTime = value;
                    if (
                      isSameOrAfter(value, startTime) === false &&
                      is_delete === 1
                    ) {
                      return message(
                        'admin.organisation_available_days_slot_4_enter_valid_end_time'
                      );
                    }
                    if (same_time_check.length >= 2 && is_delete === 1) {
                      return message(
                        'admin.organisation_available_days_slot_4_end_time_already_exits'
                      );
                    }
                    data.forEach((value1) => {
                      if (
                        valueTime < value1.end_time &&
                        value1.is_delete === 1
                      ) {
                        cntStart += 1;
                      }
                    });

                    if (
                      cntStart !== 0 &&
                      cntStart < same_time_check.length - 1 &&
                      is_delete === 1
                    ) {
                      return message(
                        `admin.organisation_available_days_slot_4_enter_valid_end_time_already_exits`
                      );
                    }
                    return true;
                  }),
                otherwise: Joi.optional(),
              }),
            })
          )
          .min(1),
        days_slot_5: Joi.array()
          .items(
            Joi.object().keys({
              org_slot_id: Joi.optional(),
              is_closed: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organisation_available_days_slot_5_is_closed_validation_required',
                'any.required':
                  'admin.organisation_available_days_slot_5_is_closed_validation_required',
                'any.base.valid':
                  'admin.organisation_available_days_slot_5_is_closed_validation_valid',
              }),
              is_new: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organisation_available_days_slot_5_is_new_validation_required',
                'any.required':
                  'admin.organisation_available_days_slot_5_is_new_validation_required',
                'any.base.valid':
                  'admin.organisation_available_days_slot_5_is_new_validation_valid',
              }),
              is_delete: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organisation_available_days_slot_5_is_delete_validation_required',
                'any.required':
                  'admin.organisation_available_days_slot_5_is_delete_validation_required',
                'any.base.valid':
                  'admin.organisation_available_days_slot_5_is_delete_validation_valid',
              }),
              start_time: Joi.when('is_closed', {
                is: 1,
                then: Joi.string()
                  .regex(/^([0-9]{2}):([0-9]{2})$/)
                  .required()
                  .custom((value, { state, message }) => {
                    const path = state.path[1];
                    const data = state.ancestors[1];
                    const { is_delete } = data[path];
                    const endTime = data[path].end_time;
                    const same_time_check = data.filter(
                      (v) => v.start_time === value && v.is_delete === 1
                    );
                    let cntStart = path;
                    const valueTime = value;
                    if (
                      isSameOrBefore(value, endTime) === false &&
                      is_delete === 1
                    ) {
                      return message(
                        'admin.organisation_available_days_slot_5_enter_valid_start_time'
                      );
                    }
                    if (same_time_check.length >= 2 && is_delete === 1) {
                      return message(
                        'admin.organisation_available_days_slot_5_start_time_already_exits'
                      );
                    }
                    data.forEach((value1) => {
                      if (
                        valueTime < value1.start_time &&
                        value1.is_delete === 1
                      ) {
                        cntStart += 1;
                      }
                    });

                    if (
                      cntStart !== 0 &&
                      cntStart < same_time_check.length - 1 &&
                      is_delete === 1
                    ) {
                      return message(
                        `admin.organisation_available_days_slot_5_enter_valid_start_time_already_exits`
                      );
                    }
                    return true;
                  }),
                otherwise: Joi.optional(),
              }),
              end_time: Joi.when('is_closed', {
                is: 1,
                then: Joi.string()
                  .regex(/^([0-9]{2}):([0-9]{2})$/)
                  .required()
                  .custom((value, { state, message }) => {
                    const path = state.path[1];
                    const data = state.ancestors[1];
                    const { is_delete } = data[path];
                    const startTime = data[path].start_time;
                    const same_time_check = data.filter(
                      (v) => v.end_time === value && v.is_delete === 1
                    );
                    let cntStart = path;
                    const valueTime = value;
                    if (
                      isSameOrAfter(value, startTime) === false &&
                      is_delete === 1
                    ) {
                      return message(
                        'admin.organisation_available_days_slot_5_enter_valid_end_time'
                      );
                    }
                    if (same_time_check.length >= 2 && is_delete === 1) {
                      return message(
                        'admin.organisation_available_days_slot_5_end_time_already_exits'
                      );
                    }
                    data.forEach((value1) => {
                      if (
                        valueTime < value1.end_time &&
                        value1.is_delete === 1
                      ) {
                        cntStart += 1;
                      }
                    });

                    if (
                      cntStart !== 0 &&
                      cntStart < same_time_check.length - 1 &&
                      is_delete === 1
                    ) {
                      return message(
                        `admin.organisation_available_days_slot_5_enter_valid_end_time_already_exits`
                      );
                    }
                    return true;
                  }),
                otherwise: Joi.optional(),
              }),
            })
          )
          .min(1),
        days_slot_6: Joi.array()
          .items(
            Joi.object().keys({
              org_slot_id: Joi.optional(),
              is_closed: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organisation_available_days_slot_6_is_closed_validation_required',
                'any.required':
                  'admin.organisation_available_days_slot_6_is_closed_validation_required',
                'any.base.valid':
                  'admin.organisation_available_days_slot_6_is_closed_validation_valid',
              }),
              is_new: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organisation_available_days_slot_6_is_new_validation_required',
                'any.required':
                  'admin.organisation_available_days_slot_6_is_new_validation_required',
                'any.base.valid':
                  'admin.organisation_available_days_slot_6_is_new_validation_valid',
              }),
              is_delete: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organisation_available_days_slot_6_is_delete_validation_required',
                'any.required':
                  'admin.organisation_available_days_slot_6_is_delete_validation_required',
                'any.base.valid':
                  'admin.organisation_available_days_slot_6_is_delete_validation_valid',
              }),
              start_time: Joi.when('is_closed', {
                is: 1,
                then: Joi.string()
                  .regex(/^([0-9]{2}):([0-9]{2})$/)
                  .required()
                  .custom((value, { state, message }) => {
                    const path = state.path[1];
                    const data = state.ancestors[1];
                    const { is_delete } = data[path];
                    const endTime = data[path].end_time;
                    const same_time_check = data.filter(
                      (v) => v.start_time === value && v.is_delete === 1
                    );
                    let cntStart = path;
                    const valueTime = value;
                    if (
                      isSameOrBefore(value, endTime) === false &&
                      is_delete === 1
                    ) {
                      return message(
                        'admin.organisation_available_days_slot_6_enter_valid_start_time'
                      );
                    }
                    if (same_time_check.length >= 2 && is_delete === 1) {
                      return message(
                        'admin.organisation_available_days_slot_6_start_time_already_exits'
                      );
                    }
                    data.forEach((value1) => {
                      if (
                        valueTime < value1.start_time &&
                        value1.is_delete === 1
                      ) {
                        cntStart += 1;
                      }
                    });

                    if (
                      cntStart !== 0 &&
                      cntStart < same_time_check.length - 1 &&
                      is_delete === 1
                    ) {
                      return message(
                        `admin.organisation_available_days_slot_6_enter_valid_start_time_already_exits`
                      );
                    }
                    return true;
                  }),
                otherwise: Joi.optional(),
              }),
              end_time: Joi.when('is_closed', {
                is: 1,
                then: Joi.string()
                  .regex(/^([0-9]{2}):([0-9]{2})$/)
                  .required()
                  .custom((value, { state, message }) => {
                    const path = state.path[1];
                    const data = state.ancestors[1];
                    const { is_delete } = data[path];
                    const startTime = data[path].start_time;
                    const same_time_check = data.filter(
                      (v) => v.end_time === value && v.is_delete === 1
                    );
                    let cntStart = path;
                    const valueTime = value;
                    if (
                      isSameOrAfter(value, startTime) === false &&
                      is_delete === 1
                    ) {
                      return message(
                        'admin.organisation_available_days_slot_6_enter_valid_end_time'
                      );
                    }
                    if (same_time_check.length >= 2 && is_delete === 1) {
                      return message(
                        'admin.organisation_available_days_slot_6_end_time_already_exits'
                      );
                    }
                    data.forEach((value1) => {
                      if (
                        valueTime < value1.end_time &&
                        value1.is_delete === 1
                      ) {
                        cntStart += 1;
                      }
                    });

                    if (
                      cntStart !== 0 &&
                      cntStart < same_time_check.length - 1 &&
                      is_delete === 1
                    ) {
                      return message(
                        `admin.organisation_available_days_slot_6_enter_valid_end_time_already_exits`
                      );
                    }
                    return true;
                  }),
                otherwise: Joi.optional(),
              }),
            })
          )
          .min(1),
        days_slot_7: Joi.array()
          .items(
            Joi.object().keys({
              org_slot_id: Joi.optional(),
              is_closed: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organisation_available_days_slot_7_is_closed_validation_required',
                'any.required':
                  'admin.organisation_available_days_slot_7_is_closed_validation_required',
                'any.base.valid':
                  'admin.organisation_available_days_slot_7_is_closed_validation_valid',
              }),
              is_new: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organisation_available_days_slot_7_is_new_validation_required',
                'any.required':
                  'admin.organisation_available_days_slot_7_is_new_validation_required',
                'any.base.valid':
                  'admin.organisation_available_days_slot_7_is_new_validation_valid',
              }),
              is_delete: Joi.number().required().valid(1, 2).messages({
                'number.base':
                  'admin.organisation_available_days_slot_7_is_delete_validation_required',
                'any.required':
                  'admin.organisation_available_days_slot_7_is_delete_validation_required',
                'any.base.valid':
                  'admin.organisation_available_days_slot_7_is_delete_validation_valid',
              }),
              start_time: Joi.when('is_closed', {
                is: 1,
                then: Joi.string()
                  .regex(/^([0-9]{2}):([0-9]{2})$/)
                  .required()
                  .custom((value, { state, message }) => {
                    const path = state.path[1];
                    const data = state.ancestors[1];
                    const { is_delete } = data[path];
                    const endTime = data[path].end_time;
                    const same_time_check = data.filter(
                      (v) => v.start_time === value && v.is_delete === 1
                    );
                    let cntStart = path;
                    const valueTime = value;
                    if (
                      isSameOrBefore(value, endTime) === false &&
                      is_delete === 1
                    ) {
                      return message(
                        'admin.organisation_available_days_slot_7_enter_valid_start_time'
                      );
                    }
                    if (same_time_check.length >= 2 && is_delete === 1) {
                      return message(
                        'admin.organisation_available_days_slot_7_start_time_already_exits'
                      );
                    }
                    data.forEach((value1) => {
                      if (
                        valueTime < value1.start_time &&
                        value1.is_delete === 1
                      ) {
                        cntStart += 1;
                      }
                    });

                    if (
                      cntStart !== 0 &&
                      cntStart < same_time_check.length - 1 &&
                      is_delete === 1
                    ) {
                      return message(
                        `admin.organisation_available_days_slot_7_enter_valid_start_time_already_exits`
                      );
                    }
                    return true;
                  }),
                otherwise: Joi.optional(),
              }),
              end_time: Joi.when('is_closed', {
                is: 1,
                then: Joi.string()
                  .regex(/^([0-9]{2}):([0-9]{2})$/)
                  .required()
                  .custom((value, { state, message }) => {
                    const path = state.path[1];
                    const data = state.ancestors[1];
                    const { is_delete } = data[path];
                    const startTime = data[path].start_time;
                    const same_time_check = data.filter(
                      (v) => v.end_time === value && v.is_delete === 1
                    );
                    let cntStart = path;
                    const valueTime = value;
                    if (
                      isSameOrAfter(value, startTime) === false &&
                      is_delete === 1
                    ) {
                      return message(
                        'admin.organisation_available_days_slot_7_enter_valid_end_time'
                      );
                    }
                    if (same_time_check.length >= 2 && is_delete === 1) {
                      return message(
                        'admin.organisation_available_days_slot_7_end_time_already_exits'
                      );
                    }
                    data.forEach((value1) => {
                      if (
                        valueTime < value1.end_time &&
                        value1.is_delete === 1
                      ) {
                        cntStart += 1;
                      }
                    });

                    if (
                      cntStart !== 0 &&
                      cntStart < same_time_check.length - 1 &&
                      is_delete === 1
                    ) {
                      return message(
                        `admin.organisation_available_days_slot_7_enter_valid_end_time_already_exits`
                      );
                    }
                    return true;
                  }),
                otherwise: Joi.optional(),
              }),
            })
          )
          .min(1),
      }),
    };
  }

  addUpdateDateSpecificAvailability() {
    return {
      body: Joi.object({
        date: Joi.date()
          .required()
          .min(moment().format('YYYY-MM-DD'))
          .messages({
            'string.empty':
              'admin.organization_availability_specific_date_slot_date_validation_required',
            'string.base':
              'admin.organization_availability_specific_date_slot_date_validation_required',
            'any.required':
              'admin.organization_availability_specific_date_slot_date_validation_required',
            'any.min':
              'admin.organization_availability_specific_date_slot_date_min_validation_required',
          }),
        slots: Joi.array().items(
          Joi.object().keys({
            org_specific_date_slot_id: Joi.number().required().messages({
              'string.empty':
                'admin.organization_availability_org_specific_date_slot_id_validation_required',
              'string.base':
                'admin.organization_availability_org_specific_date_slot_id_validation_required',
              'any.required':
                'admin.organization_availability_org_specific_date_slot_id_validation_required',
            }),
            is_closed: Joi.number().required().valid(1, 2).messages({
              'number.base':
                'admin.organisation_available_specific_date_slot_is_closed_validation_required',
              'any.required':
                'admin.organisation_available_specific_date_slot_is_closed_validation_required',
              'any.base.valid':
                'admin.organisation_available_specific_date_slot_is_closed_validation_valid',
            }),
            is_new: Joi.number().required().valid(1, 2).messages({
              'number.base':
                'admin.organisation_available_specific_date_slot_is_new_validation_required',
              'any.required':
                'admin.organisation_available_specific_date_slot_is_new_validation_required',
              'any.base.valid':
                'admin.organisation_available_specific_date_slot_is_new_validation_valid',
            }),
            is_delete: Joi.number().required().valid(1, 2).messages({
              'number.base':
                'admin.organisation_available_specific_date_slot_is_delete_validation_required',
              'any.required':
                'admin.organisation_available_specific_date_slot_is_delete_validation_required',
              'any.base.valid':
                'admin.organisation_available_specific_date_slot_is_delete_validation_valid',
            }),
            start_time: Joi.string()
              .regex(/^([0-9]{2}):([0-9]{2})$/)
              .required()
              .custom((value, { state, message }) => {
                const path = state.path[1];
                const data = state.ancestors[1];
                const endTime = data[path].end_time;
                const { is_delete } = data[path];
                const same_time_check = data.filter(
                  (v) => v.start_time === value && v.is_delete === 1
                );
                let cntStart = path;
                const valueTime = value;
                if (
                  isSameOrBefore(value, endTime) === false &&
                  is_delete === 1
                ) {
                  return message(
                    'admin.organisation_available_specific_date_slot_enter_valid_start_time'
                  );
                }
                if (same_time_check.length >= 2 && is_delete === 1) {
                  return message(
                    'admin.organisation_available_specific_date_slot_start_time_already_exits'
                  );
                }
                data.forEach((value1) => {
                  if (valueTime < value1.start_time && value1.is_delete === 1) {
                    cntStart += 1;
                  }
                });
                if (
                  cntStart !== 0 &&
                  cntStart < same_time_check.length - 1 &&
                  is_delete === 1
                ) {
                  return message(
                    `admin.organisation_available_specific_date_slot_enter_valid_start_time_already_exits`
                  );
                }
                return true;
              }),
            end_time: Joi.string()
              .regex(/^([0-9]{2}):([0-9]{2})$/)
              .required()
              .custom((value, { state, message }) => {
                const path = state.path[1];
                const data = state.ancestors[1];
                const startTime = data[path].start_time;
                const { is_delete } = data[path];
                const same_time_check = data.filter(
                  (v) => v.end_time === value && v.is_delete === 1
                );
                let cntStart = path;
                const valueTime = value;
                if (
                  isSameOrAfter(value, startTime) === false &&
                  is_delete === 1
                ) {
                  return message(
                    'admin.organisation_available_specific_date_slot_enter_valid_end_time'
                  );
                }
                if (same_time_check.length >= 2 && is_delete === 1) {
                  return message(
                    'admin.organisation_available_specific_date_slot_end_time_already_exits'
                  );
                }
                data.forEach((value1) => {
                  if (valueTime < value1.end_time && value1.is_delete === 1) {
                    cntStart += 1;
                  }
                });

                if (
                  cntStart !== 0 &&
                  cntStart < same_time_check.length - 1 &&
                  is_delete === 1
                ) {
                  return message(
                    `admin.organisation_available_specific_date_slot_enter_valid_end_time_already_exits`
                  );
                }
                return true;
              }),
          })
        ),
      }),
    };
  }

  getListDateSpecificAvailabilities() {
    return {
      query: Joi.object({
        date: Joi.date()
          .required()
          .min(moment(Date.now()).format('YYYY-MM-DD'))
          .messages({
            'string.empty':
              'admin.organization_availability_specific_date_slot_date_validation_required',
            'string.base':
              'admin.organization_availability_specific_date_slot_date_validation_required',
            'any.required':
              'admin.organization_availability_specific_date_slot_date_validation_required',
            'any.min':
              'admin.organization_availability_specific_date_slot_date_min_validation_required',
          }),
      }),
    };
  }
}

module.exports = new AvailabilityValidations();
