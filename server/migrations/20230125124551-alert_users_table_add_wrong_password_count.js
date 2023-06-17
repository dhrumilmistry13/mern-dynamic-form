module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'password_wrong_count', {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
      after: 'profile_setup',
    });
  },
};
