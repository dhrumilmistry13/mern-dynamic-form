module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('formulary', 'price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
  },
};
