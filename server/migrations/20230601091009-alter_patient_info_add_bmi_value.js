/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('patient_info', 'bmi_value', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
      defaultValue: null,
      after: 'transitionrx_patient_id',
    });
  },
};
