module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      country_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'countries', key: 'country_id' },
      },
      phone: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING(150),
        allowNull: true,
        defaultValue: null,
      },
      profile_image: {
        type: Sequelize.STRING(155),
        allowNull: true,
        defaultValue: null,
      },
      organation_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      account_type: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '1=>Email,2=>google,3=>facebook',
        defaultValue: 1,
      },
      user_type: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '1=>Admin,2=>Organization,3=>Patient',
        defaultValue: 1,
      },
      is_email_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '1=>verified,2=>Not verified',
        defaultValue: 2,
      },
      is_fb_email_verify: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '1=Yes,2=No',
        defaultValue: 2,
      },
      facebook_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: null,
      },
      is_gmail_email_verify: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '1=Yes,2=No',
        defaultValue: 2,
      },
      gmail_id: {
        type: Sequelize.STRING(40),
        allowNull: true,
        defaultValue: null,
      },
      email_otp: {
        type: Sequelize.STRING(6),
        allowNull: true,
        defaultValue: null,
      },
      admin_status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '1=Active 2=Inactive',
        defaultValue: 1,
      },
      user_status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '1=Active 2=Inactive,3=>Lockout',
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
    await queryInterface.dropTable('users');
  },
};
