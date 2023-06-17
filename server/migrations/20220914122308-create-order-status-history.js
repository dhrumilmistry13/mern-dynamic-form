module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_status_histories', {
      order_status_history_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      order_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'orders', key: 'order_id' },
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment:
          '1=>Draft,2=> Placed,3=> Rx Accepted,4=> Pharmacy order placed,5=> delivered,6=> Canceled',
        defaultValue: 1,
      },
      created_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('order_status_histories');
  },
};
