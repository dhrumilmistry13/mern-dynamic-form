module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'packing_shipping_fee', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
      after: 'total_amount',
    });
    await queryInterface.addColumn('orders', 'doctor_visit_fee', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
      after: 'packing_shipping_fee',
    });
    await queryInterface.addColumn('orders', 'telemedicine_platform_fee', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
      after: 'doctor_visit_fee',
    });
    await queryInterface.addColumn('orders', 'medication_cost', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
      after: 'telemedicine_platform_fee',
    });
  },
};
