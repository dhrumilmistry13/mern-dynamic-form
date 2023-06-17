module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscription_history', {
      subscription_history_id: {
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
      card_no: {
        type: Sequelize.INTEGER,
        comment: 'card last 4 digit only we store',
        allowNull: true,
      },
      card_id: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      transaction_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '1=>Success,2=>Failed, 3=>Retry',
        defaultValue: 2,
      },

      subscription_status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '1=>Expired,2=>Active,3=>Cancelled,4=>Renewed',
      },
      plan_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      plan_amount: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      cancelled_date: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'means subscription cancel date',
      },
      renewed_date: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'means expire date',
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
    await queryInterface.dropTable('subscription_history');
  },
};
