module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('states', {
      state_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      country_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'countries', key: 'country_id' },
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      short_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      sequence: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '1=Active 2=Inactive',
        defaultValue: 1,
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
    await queryInterface.dropTable('states');
  },
};
