module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('organization_info', 'doctor_visit_fee', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
      after: 'is_insurence',
    });
  },
};
