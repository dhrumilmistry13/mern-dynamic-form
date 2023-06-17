/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('organization_staff_infos', {
      organization_staff_info_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      organation_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
        references: { model: 'users', key: 'user_id' },
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
      },
      fax_number: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: null,
      },
      npi_number: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: null,
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      city: {
        type: Sequelize.STRING(30),
        allowNull: true,
        defaultValue: null,
      },
      state: {
        type: Sequelize.STRING(30),
        allowNull: true,
        defaultValue: null,
      },
      postcode: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: null,
      },
      country: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: null,
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true,
        defaultValue: null,
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true,
        defaultValue: null,
      },
      dosespot_org_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: null,
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
    await queryInterface.dropTable('organization_staff_infos');
  },
};
