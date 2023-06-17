const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserQuestionAns extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ UserQuestionAnsOption, Questions, Users }) {
      this.belongsTo(Users, { foreignKey: 'user_id', as: 'users' });
      this.hasMany(UserQuestionAnsOption, {
        foreignKey: 'user_question_ans_id',
        as: 'user_question_ans_option',
      });
      this.belongsTo(Questions, { foreignKey: 'question_id', as: 'questions' });
    }
  }
  UserQuestionAns.init(
    {
      user_question_ans_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      question_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'questions', key: 'question_id' },
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'users', key: 'user_id' },
      },
      organation_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'users', key: 'user_id' },
      },
      order_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'orders', key: 'order_id' },
        defaultValue: null,
      },
      ans_value: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ans_type: {
        type: DataTypes.BOOLEAN,
        comment: '1=>Text,2=>Option,3=>File,4=>Date',
        defaultValue: 1,
        get() {
          if (this.getDataValue('ans_type') === true) return 1;
          return this.getDataValue('ans_type');
        },
      },
      question_text: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_at: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null,
      },
      updated_at: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null,
      },
      deleted_at: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: 'UserQuestionAns',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'user_question_ans',
      defaultScope: {
        attributes: {
          exclude: ['created_at', 'updated_at', 'deleted_at'],
        },
      },
    }
  );
  return UserQuestionAns;
};
