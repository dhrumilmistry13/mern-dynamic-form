module.exports = {
  up: (queryInterface) =>
    queryInterface.sequelize.query(
      'ALTER TABLE `user_transactions` CHANGE `user_card_id` `user_card_id` INT UNSIGNED NULL DEFAULT NULL'
    ),
};
