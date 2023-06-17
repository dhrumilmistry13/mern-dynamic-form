module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('formulary', {
      formulary_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      dosage_amount: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      ndc: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      featured_image: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sequence: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('formulary');
  },
};
