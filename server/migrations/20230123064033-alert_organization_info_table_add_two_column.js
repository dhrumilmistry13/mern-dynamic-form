module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('organization_info', 'fax_number', {
      type: Sequelize.STRING(20),
      allowNull: true,
      defaultValue: null,
      after: 'fill_step',
    });
    await queryInterface.addColumn('organization_info', 'npi_number', {
      type: Sequelize.STRING(20),
      allowNull: true,
      defaultValue: null,
      after: 'fax_number',
    });
    await queryInterface.addColumn('organization_info', 'dosespot_org_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      defaultValue: null,
      after: 'npi_number',
    });
  },
};
