module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('user_cards', 'pay_id', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
      after: 'card_id',
    });
  },
};
