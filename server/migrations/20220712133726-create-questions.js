module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      question_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      label: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      is_required: {
        type: Sequelize.BOOLEAN,
        comment: '2=>InActive,1=>Active',
        defaultValue: 1,
      },
      type: {
        type: Sequelize.BOOLEAN,
        comment: '1=>Intake,2=>Business,3=>Formulary,4=>Checkout',
        defaultValue: 1,
      },
      question_type: {
        type: Sequelize.BOOLEAN,
        comment:
          '1=>free text,2=>text area,3=>drop down,4=>radio button,5=>multiple choice,6=>upload,7=>date,8=>state drop down',
        defaultValue: 1,
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'users', key: 'user_id' },
      },
      formulary_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'formulary', key: 'formulary_id' },
      },
      old_question_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'formulary', key: 'formulary_id' },
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
    await queryInterface.dropTable('questions');
  },
};
