/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('users', 'user_type', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      comment:
        '1=>Admin,2=>Organization,3=>Patient,4=>Staff,5=>Organization Super Prescriber ,6=>Organization Doctor',
      defaultValue: 1,
    });
  },
};
