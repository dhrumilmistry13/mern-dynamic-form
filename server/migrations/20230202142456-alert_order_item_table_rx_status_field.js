module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('order_items', 'rx_status', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
      comment: '1=>pending,2=>Accept,3=>Reject,4=>Refunded',
      after: 'sub_total',
    });
  },
};
