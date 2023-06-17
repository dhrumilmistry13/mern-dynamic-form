module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_addresses', {
      order_address_id: {
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
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: null,
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: null,
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: true,
        defaultValue: null,
      },
      country_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'countries', key: 'country_id' },
        defaultValue: null,
      },
      phone: {
        type: Sequelize.STRING(30),
        allowNull: true,
        defaultValue: null,
      },
      address: {
        allowNull: true,
        type: Sequelize.TEXT,
        defaultValue: null,
      },
      city: {
        type: Sequelize.STRING(30),
        allowNull: true,
        defaultValue: null,
      },
      state_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'states', key: 'state_id' },
        defaultValue: null,
      },
      zipcode: {
        type: Sequelize.STRING(30),
        allowNull: true,
        defaultValue: null,
      },
      is_billing_same: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '1=>Yes,2=>No',
        defaultValue: 2,
      },
      type: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '1=>Shipping,2=>Billing',
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
    await queryInterface.dropTable('order_addresses');
  },
};
