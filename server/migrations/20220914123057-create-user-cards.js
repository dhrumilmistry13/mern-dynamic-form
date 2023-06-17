module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_cards', {
      user_card_id: {
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
      card_id: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      type: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        comment: '1=>Master,2=>Visa,3=>American Express,4=>other',
      },
      card_last_digit: {
        type: Sequelize.STRING(30),
        allowNull: true,
        defaultValue: null,
      },
      expire_date: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '1=>Yes,2=>No',
        defaultValue: 2,
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
    await queryInterface.dropTable('user_cards');
  },
};
