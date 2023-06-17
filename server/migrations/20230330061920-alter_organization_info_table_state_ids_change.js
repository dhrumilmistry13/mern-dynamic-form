module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('organization_info', 'state_ids', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },
};
