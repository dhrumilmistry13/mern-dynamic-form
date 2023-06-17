module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('orders', 'order_status', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      comment:
        '1=>Draft,2=> Placed,3=> Rx Accepted,4=> Pharmacy order placed,5=> delivered,6=> Canceled',
      defaultValue: 1,
    });
  },
};
