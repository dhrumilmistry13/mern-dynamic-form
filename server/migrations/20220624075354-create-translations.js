module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('translations', {
      translation_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      group: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      key: {
        type: Sequelize.STRING(191),
        allowNull: false,
        unique: true,
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
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
    await queryInterface.dropTable('translations');
  },
};
