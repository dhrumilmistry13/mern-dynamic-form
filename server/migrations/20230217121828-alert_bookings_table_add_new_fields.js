module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('bookings', 'booking_notes', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      after: 'booking_status',
    });
    await queryInterface.addColumn('bookings', 'patient_join_unique_id', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
      after: 'patient_join_time',
    });
    await queryInterface.addColumn('bookings', 'org_join_unique_id', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
      after: 'org_join_time',
    });
  },
};
