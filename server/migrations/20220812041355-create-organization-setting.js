module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('organization_setting', {
      organization_setting_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'users', key: 'user_id' },
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
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('organization_setting');
  },
};
