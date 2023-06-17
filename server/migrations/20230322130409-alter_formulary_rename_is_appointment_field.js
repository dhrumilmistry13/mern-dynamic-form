/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'formulary',
      'is_appointment',
      'is_appointment_required',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '1=>Yes,2=>No',
        defaultValue: 2,
        after: 'status',
      }
    );
  },
};
