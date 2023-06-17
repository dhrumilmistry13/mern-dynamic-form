module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('organization_specialities', {
      organization_specialities_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      organization_info_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'organization_info', key: 'organization_info_id' },
      },
      specialities_type: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '1=specialities 2=Other',
        defaultValue: 1,
      },
      specialities_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'specialities', key: 'specialities_id' },
      },
      typespecialities_other_text: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      created_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('organization_specialities');
  },
};
