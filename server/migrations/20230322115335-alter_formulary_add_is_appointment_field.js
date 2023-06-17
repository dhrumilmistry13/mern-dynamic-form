/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('formulary', 'is_appointment', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      comment: '1=>Yes,2=>No',
      defaultValue: 2,
      after: 'status',
    });
  },
};
