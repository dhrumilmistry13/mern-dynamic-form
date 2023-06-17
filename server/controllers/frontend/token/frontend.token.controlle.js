const { Op } = require('sequelize');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');

class TokenController {
  /**
   * @name getBusinessQuestions
   * @description Get All Business Questions Data.
   * @param req,res
   * @returns {Json} success
   */
  async storeWebToken(req, res) {
    try {
      const { token } = req.body;
      const { user_id } = req.payload.user;
      const tokenData = await models.UserToken.findOne({
        where: {
          token,
        },
      });
      if (tokenData) {
        if (token.user_id !== user_id) {
          tokenData.user_id = user_id;
          await tokenData.save();
        }
      } else {
        await models.UserToken.create({
          token,
          user_id,
        });
      }
      return response.successResponse(
        req,
        res,
        'admin.front_user_token_save_success',
        {},
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name storeTimezone
   * @description Store Timezone user.
   * @param req,res
   * @returns {Json} success
   */
  async storeTimezone(req, res) {
    try {
      const { timezone } = req.body;
      const { user_id } = req.payload.user;
      let timezoneData = await models.Timezones.findOne({
        where: {
          utc: {
            [Op.like]: `%${timezone}%`,
          },
        },
      });
      if (timezoneData) {
        timezoneData = await models.Timezones.findOne({
          where: {
            title: {
              [Op.like]: `%${timezoneData.title}%`,
            },
          },
          group: [['title']],
        });
        await models.Users.update(
          {
            timezone_id: timezoneData.timezone_id,
          },
          {
            where: {
              user_id,
            },
          }
        );
      }
      return response.successResponse(
        req,
        res,
        'admin.front_timezone_save_success',
        {},
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}

module.exports = new TokenController();
