/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('bookings', 'order_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: 'orders', key: 'order_id' },
      defaultValue: null,
    });
    await queryInterface.addColumn('bookings', 'order_item_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: 'order_items', key: 'order_item_id' },
      defaultValue: null,
    });
  },
};
