/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('formulary', 'doctor_visit_override', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      comment: '1=>yes,2=>no',
      defaultValue: 1,
      after: 'is_appointment_required',
    });
  },
};
