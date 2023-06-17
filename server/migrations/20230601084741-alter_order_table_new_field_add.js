/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('orders', 'doctor_visit_override', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      comment: '1=>yes,2=>no',
      defaultValue: 1,
      after: 'order_note',
    });
    await queryInterface.addColumn('orders', 'assigner_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      references: { model: 'users', key: 'user_id' },
      after: 'doctor_visit_override',
    });
  },
};
