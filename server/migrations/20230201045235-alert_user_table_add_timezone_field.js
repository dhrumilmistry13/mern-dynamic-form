module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'timezone_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null,
      references: { model: 'timezones', key: 'timezone_id' },
      after: 'password_wrong_count',
    });
  },
};
