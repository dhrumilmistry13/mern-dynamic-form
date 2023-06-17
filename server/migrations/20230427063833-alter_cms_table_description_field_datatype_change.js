module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('cms', 'description', {
      type: Sequelize.TEXT('long'),
      allowNull: false,
    });
  },
};
