module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('users', 'profile_setup', {
      type: Sequelize.BOOLEAN,
      comment: '1=>Complete,2=>Pending',
      defaultValue: 1,
      after: 'user_status',
    });
  },
};
