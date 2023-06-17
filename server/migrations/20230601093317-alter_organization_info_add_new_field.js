/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('organization_info', 'custom_domain', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      comment: '1=>yes,2=>no',
      defaultValue: 2,
      after: 'telemedicine_platform_fee',
    });
    await queryInterface.addColumn('organization_info', 'custom_domain_name', {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: null,
      after: 'custom_domain',
    });
  },
};
