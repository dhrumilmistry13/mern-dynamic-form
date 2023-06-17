const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');

class CardController {
  /**
   * @name addCard
   * @description Store Card Data.
   * @param req,res
   * @returns {Json} success
   */
  async addCard(req, res) {
    try {
      const { card_id, pay_id, type, card_last_digit, expire_date } = req.body;
      const { user_id, user_type, organization_id } = req.payload.user;
      if (user_type === 2) {
        await models.UserCards.findAll(
          {
            is_default: 2,
          },
          {
            where: { user_id: organization_id },
            order: [['user_card_id', 'ASC']],
          }
        );
        await models.UserCards.findOne({
          where: { user_id: organization_id },
          order: [['user_card_id', 'ASC']],
        }).then(async (obj) => {
          if (obj) {
            obj.update({
              user_id: organization_id,
              card_id,
              pay_id,
              type,
              card_last_digit,
              expire_date,
              is_default: 1,
            });
          } else {
            await models.UserCards.create({
              user_id: organization_id,
              card_id,
              pay_id,
              type,
              card_last_digit,
              expire_date,
              is_default: 1,
            });
          }
        });
      } else {
        await models.UserCards.update(
          {
            is_default: 2,
          },
          {
            where: { user_id },
            order: [['user_card_id', 'ASC']],
          }
        );
        await models.UserCards.create({
          user_id,
          card_id,
          pay_id,
          type,
          card_last_digit,
          expire_date,
          is_default: 1,
        });
      }
      return response.successResponse(req, res, 'admin.create_card_success');
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getListCard
   * @description Get List card Data.
   * @param req,res
   * @returns {Json} success
   */
  async getListCard(req, res) {
    try {
      const { user_id } = req.payload.user;
      const getCardList = await models.UserCards.findAll({
        where: { user_id },
        order: [['user_card_id', 'DESC']],
      });
      return response.successResponse(
        req,
        res,
        'admin.get_card_success',
        getCardList
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name deleteCard
   * @description Delete card Data.
   * @param req,res
   * @returns {Json} success
   */
  async deleteCard(req, res) {
    try {
      const { user_card_id } = req.query;
      const { user_id } = req.payload.user;
      const getCardList = await models.UserCards.findAll({
        where: { user_id },
        order: [['user_card_id', 'ASC']],
      });
      const getCardData = await models.UserCards.findOne({
        where: { user_card_id },
        order: [['user_card_id', 'ASC']],
      });
      if (getCardList.length >= 2) {
        if (getCardData.is_default === 1) {
          await models.UserCards.findOne({
            where: { user_id },
            order: [['user_card_id', 'ASC']],
          }).then((obj) => {
            if (obj) {
              obj.update({ is_default: 1 });
            }
          });
        }
        await models.UserCards.destroy({
          where: { user_card_id },
        });
      } else {
        throw new Error('admin.delete_card_not_delete');
      }
      return response.successResponse(req, res, 'admin.delete_card_success');
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name defaultCard
   * @description Default card Data.
   * @param req,res
   * @returns {Json} success
   */
  async defaultCard(req, res) {
    try {
      const { user_card_id, is_default } = req.body;
      const { user_id } = req.payload.user;
      if (is_default === 1) {
        await models.UserCards.update(
          { is_default: 2 },
          {
            where: { user_id },
          }
        );
      }
      await models.UserCards.update(
        { is_default },
        {
          where: { user_card_id },
        }
      );
      return response.successResponse(
        req,
        res,
        'admin.set_default_card_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new CardController();
