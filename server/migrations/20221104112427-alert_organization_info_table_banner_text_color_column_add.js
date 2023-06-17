module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('organization_info', 'banner_text_color', {
      type: Sequelize.STRING(50),
      allowNull: true,
      defaultValue: null,
      after: 'primary_color',
    });
  },
};
