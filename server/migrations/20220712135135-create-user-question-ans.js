module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_question_ans', {
      user_question_ans_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      question_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'questions', key: 'question_id' },
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'users', key: 'user_id' },
      },
      organation_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'users', key: 'user_id' },
      },
      ans_value: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      ans_type: {
        type: Sequelize.BOOLEAN,
        comment: '1=>Text,2=>Option',
        defaultValue: 1,
      },
      question_text: {
        type: Sequelize.STRING(255),
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
    await queryInterface.dropTable('user_question_ans');
  },
};
