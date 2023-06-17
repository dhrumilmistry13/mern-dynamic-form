module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('bookings', 'timezone_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null,
      references: { model: 'timezones', key: 'timezone_id' },
      after: 'org_specific_date_slot_id',
    });
  },
};
