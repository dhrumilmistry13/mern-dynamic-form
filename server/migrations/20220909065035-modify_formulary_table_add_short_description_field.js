module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('formulary', 'short_description', {
      type: Sequelize.TEXT('medium'),
      allowNull: true,
      after: 'description',
    });
  },
};
