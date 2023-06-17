module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      order_id: {
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
        allowNull: true,
        references: { model: 'users', key: 'user_id' },
        defaultValue: null,
      },
      transaction_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      payment_status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '1=>Paid,2=>Pending,3=>Failed,4=>Cancel',
        defaultValue: 2,
      },
      order_status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment:
          '1=>Draft,2=> Placed,3=> Rx Accepted,4=> Pharmacy order placed,5=> delivered,6=> Canceled',
        defaultValue: 1,
      },
      payout_status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '1=>Paid,2=>Pending',
        defaultValue: 2,
      },
      payout_note: {
        allowNull: true,
        type: Sequelize.TEXT,
        defaultValue: null,
      },
      document_id: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: null,
      },
      selfi_image: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: null,
      },
      card_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: null,
      },
      order_note: {
        allowNull: true,
        type: Sequelize.TEXT,
        defaultValue: null,
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
    await queryInterface.dropTable('orders');
  },
};
