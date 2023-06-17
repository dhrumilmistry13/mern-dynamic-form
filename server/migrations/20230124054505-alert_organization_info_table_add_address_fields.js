module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('organization_info', 'address', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
      after: 'npi_number',
    });
    await queryInterface.addColumn('organization_info', 'city', {
      type: Sequelize.STRING(30),
      allowNull: true,
      defaultValue: null,
      after: 'address',
    });
    await queryInterface.addColumn('organization_info', 'state', {
      type: Sequelize.STRING(30),
      allowNull: true,
      defaultValue: null,
      after: 'city',
    });
    await queryInterface.addColumn('organization_info', 'postcode', {
      type: Sequelize.STRING(20),
      allowNull: true,
      defaultValue: null,
      after: 'state',
    });
    await queryInterface.addColumn('organization_info', 'country', {
      type: Sequelize.STRING(20),
      allowNull: true,
      defaultValue: null,
      after: 'postcode',
    });
  },
};
