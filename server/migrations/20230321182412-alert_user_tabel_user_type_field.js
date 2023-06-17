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
      comment: '1=>Admin,2=>Organization,3=>Patient,4=>Organization Staff',
      defaultValue: 1,
    });
  },
};
