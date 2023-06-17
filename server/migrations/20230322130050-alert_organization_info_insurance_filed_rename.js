module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'organization_info',
      'is_insurence',
      'is_insurance_required',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 2,
        comment: '1=>on,2=>off',
        after: 'dosespot_org_id',
      }
    );
  },
};
