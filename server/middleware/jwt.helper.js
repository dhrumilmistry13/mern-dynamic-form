const jwt = require('jsonwebtoken');
const { t } = require('i18next');
const createError = require('http-errors');
const models = require('../models/index');

const accessToken = (payload) =>
  new Promise((resolve, reject) => {
    const options = {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
      issuer: process.env.APP_DOMAIN,
    };

    jwt.sign(
      payload,
      process.env.JWT_ACCESS_TOKEN_SECRET,
      options,
      (error, token) => {
        if (error) {
          reject(createError.InternalServerError());
        }
        resolve(token);
      }
    );
  });

const refreshToken = (payload) =>
  new Promise((resolve, reject) => {
    const options = {
      // expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY,
      issuer: process.env.APP_DOMAIN,
    };
    jwt.sign(
      payload,
      process.env.JWT_REFRESH_TOKEN_SECRET,
      options,
      (error, token) => {
        if (error) {
          reject(createError.InternalServerError());
        }
        resolve(token);
      }
    );
  });

const verifyAccessToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(createError.Unauthorized());
  }
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader.split(' ');
  const token = bearerToken[1];
  let payload_data = '';
  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (error, payload) => {
    if (error) {
      let message = 'Unauthorized';
      if (error.name === 'TokenExpiredError') {
        message = t('admin.auth_logout_auto_message');
      } else if (error.name === 'JsonWebTokenError') {
        message = 'Unauthorized';
      } else {
        message = error.message;
      }
      return next(createError.Unauthorized(message));
    }
    payload_data = payload;
    return payload;
  });
  req.payload = payload_data;
  if (payload_data) {
    const user = await models.Users.findOne({
      where: {
        user_id: payload_data.user.user_id,
      },
    });
    if (!user) {
      return next(createError(414, t('admin.account_not_found')));
    }
    if (user && user.admin_status === 2) {
      return next(createError(414, t('admin.account_deactivated_by_admin')));
    }
  }
  return next();
};

const verifyRefreshToken = (refreshTokenData) =>
  new Promise((resolve, reject) => {
    jwt.verify(
      refreshTokenData,
      process.env.JWT_REFRESH_TOKEN_SECRET,
      (error, payload) => {
        if (error) {
          reject(createError.Unauthorized());
        }
        resolve(payload);
      }
    );
  });

/**
 * Generate Vendor Token Payload
 */
const generateVendorTokenPayload = (vendor) => {
  const payload = {
    user: {
      id: vendor.vendor_id,
      fullname: `${vendor.vendor_firstname} ${vendor.vendor_lastname}`,
      firstname: vendor.vendor_firstname,
      lastname: vendor.vendor_lastname,
      email: vendor.vendor_email,
      mobile: vendor.vendor_mobile,
      logo: vendor.vendor_shop_logo,
      user_type: 'VENDOR',
      profile_completed: vendor.is_completed_profile,
    },
    created_at: new Date(),
  };
  return payload;
};

/**
 * Generate User Token Payload
 */
const generateUserTokenPayload = (user) => {
  const payload = {
    user: {
      user_id: user.user_id,
      fullname: `${user.first_name} ${user.last_name}`,
      firstname: user.first_name,
      lastname: user.last_name,
      email: user.email,
      login_type: user.login_type,
      user_type: user.user_type,
      organization_id: user.organation_id || user.user_id,
      admin_status: user.admin_status,
      user_status: user.user_status,
    },
    created_at: new Date(),
  };
  return payload;
};

module.exports = {
  accessToken,
  verifyAccessToken,
  refreshToken,
  verifyRefreshToken,
  generateVendorTokenPayload,
  generateUserTokenPayload,
};
