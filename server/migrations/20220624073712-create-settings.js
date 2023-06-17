module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('settings', {
      setting_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      text_key: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      text_value: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      type: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        comment: '1=Text,2=Image,3=>Video',
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
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('settings');
  },
};
