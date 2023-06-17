module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('patient_info', 'address', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
      after: 'gender',
    });
    await queryInterface.addColumn('patient_info', 'city', {
      type: Sequelize.STRING(30),
      allowNull: true,
      defaultValue: null,
      after: 'address',
    });
    await queryInterface.addColumn('patient_info', 'state', {
      type: Sequelize.STRING(30),
      allowNull: true,
      defaultValue: null,
      after: 'city',
    });
    await queryInterface.addColumn('patient_info', 'postcode', {
      type: Sequelize.STRING(20),
      allowNull: true,
      defaultValue: null,
      after: 'state',
    });
    await queryInterface.addColumn('patient_info', 'country', {
      type: Sequelize.STRING(20),
      allowNull: true,
      defaultValue: null,
      after: 'postcode',
    });
  },
};
