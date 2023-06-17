module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('users', 'reason', {
      type: Sequelize.TEXT,
      after: 'otp_expire_time',
    });
  },
};
