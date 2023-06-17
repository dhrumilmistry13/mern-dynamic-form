module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('organization_formulary', 'margin', {
      type: Sequelize.DECIMAL(6, 2),
      allowNull: true,
      defaultValue: 0,
    });
    await queryInterface.changeColumn(
      'organization_formulary',
      'patient_price',
      {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      }
    );
  },
};
