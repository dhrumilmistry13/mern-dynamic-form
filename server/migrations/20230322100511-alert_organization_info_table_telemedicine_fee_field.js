module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'organization_info',
      'telemedicine_platform_fee',
      {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
        after: 'doctor_visit_fee',
      }
    );
  },
};
