module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('organization_info', {
      organization_info_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
      },
      company_name: {
        type: Sequelize.STRING(155),
        allowNull: true,
      },
      subdomain_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      state_ids: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      header_logo: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      footer_logo: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      menu_text_color: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      button_icon_color: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      heading_color: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      text_color: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      background_color: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      primary_color: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      card_no: {
        type: Sequelize.INTEGER,
        comment: 'card last 4 digit only we store',
        allowNull: true,
      },
      card_id: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      fill_step: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: `1=>How it's work,2=>Subscription,3=>Company Info Step 1,4=>Company Info Step 2,5=>Company Info Step 3,6=>intake form,7=>formulary`,
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
    await queryInterface.dropTable('organization_info');
  },
};
