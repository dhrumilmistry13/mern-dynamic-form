module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_transactions', {
      user_transaction_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
      },
      organization_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
      },
      order_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'orders', key: 'order_id' },
      },
      order_item_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'order_items', key: 'order_item_id' },
        defaultValue: null,
      },
      type: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '1=>Order,2=>Charge,3=>refund',
        defaultValue: 1,
      },
      payment_status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '1=>Paid,2=>Failed,3=>Cancel',
        defaultValue: 2,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      transaction_id: {
        type: Sequelize.STRING(150),
        allowNull: true,
        defaultValue: null,
      },
      user_card_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'user_cards', key: 'user_card_id' },
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
    await queryInterface.dropTable('user_transactions');
  },
};
