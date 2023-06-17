module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'dob', {
      type: Sequelize.DATEONLY,
      allowNull: true,
      defaultValue: null,
      after: 'profile_image',
    });
  },
};
