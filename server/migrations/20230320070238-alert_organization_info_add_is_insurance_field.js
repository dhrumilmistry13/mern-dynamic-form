module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('organization_info', 'is_insurence', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: 2,
      comment: '1=>on,2=>off',
      after: 'dosespot_org_id',
    });
  },
};
