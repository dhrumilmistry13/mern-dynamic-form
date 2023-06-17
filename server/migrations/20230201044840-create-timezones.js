module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('timezones', {
      timezone_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: '',
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: '',
      },
      abbr: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: '',
      },
      offset: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: '',
      },
      isdst: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: '',
      },
      utc: {
        type: Sequelize.STRING(150),
        allowNull: false,
        defaultValue: '',
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
    await queryInterface.dropTable('timezones');
  },
};
