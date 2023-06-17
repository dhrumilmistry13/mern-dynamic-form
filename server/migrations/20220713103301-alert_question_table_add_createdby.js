module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('questions', 'created_by', {
      type: Sequelize.BOOLEAN,
      comment: '2=>Admin,1=>user',
      defaultValue: 1,
      after: 'status',
    });
  },
};
