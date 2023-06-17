module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('our_team', {
      our_team_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      designation: {
        type: Sequelize.STRING(155),
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING(155),
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
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
    await queryInterface.dropTable('our_team');
  },
};
