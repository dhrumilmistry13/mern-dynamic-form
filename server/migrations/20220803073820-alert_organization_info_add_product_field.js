module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(
      'organization_formulary',
      'prescription_product',
      {
        type: Sequelize.BOOLEAN,
        comment: '2=>No,1=>Yes',
        defaultValue: 2,
        after: 'patient_price',
      }
    );
    await queryInterface.addColumn(
      'organization_formulary',
      'top_discount_product',
      {
        type: Sequelize.BOOLEAN,
        comment: '2=>No,1=>Yes',
        defaultValue: 2,
        after: 'prescription_product',
      }
    );
    await queryInterface.addColumn(
      'organization_formulary',
      'popular_product',
      {
        type: Sequelize.BOOLEAN,
        comment: '2=>No,1=>Yes',
        defaultValue: 2,
        after: 'top_discount_product',
      }
    );
  },
};
