module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cms', {
      cms_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      slug: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        comment: '1=Active 2=Inactive',
        defaultValue: 1,
      },
      seo_meta_title: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      seo_meta_desc: {
        type: Sequelize.TEXT('tiny'),
        allowNull: false,
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
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('cms');
  },
};
