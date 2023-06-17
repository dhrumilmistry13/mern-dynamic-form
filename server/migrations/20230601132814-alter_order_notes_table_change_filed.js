/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('order_notes', 'order_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null,
      references: { model: 'orders', key: 'order_id' },
      after: 'organization_id',
    });
    await queryInterface.changeColumn('order_notes', 'note', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      after: 'order_id',
    });
  },
};
