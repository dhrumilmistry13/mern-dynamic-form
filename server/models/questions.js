const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class Questions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ QuestionOptions, Users, UserQuestionAns }) {
      // define association here
      this.belongsTo(Users, { foreignKey: 'user_id', as: 'users' });

      this.belongsTo(Users, { foreignKey: 'formulary_id', as: 'formulary' });
      this.hasMany(QuestionOptions, {
        foreignKey: 'question_id',
        as: 'question_options',
      });
      this.hasOne(UserQuestionAns, {
        foreignKey: 'question_id',
        as: 'user_question_ans',
      });
    }
  }
  Questions.init(
    {
      question_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      label: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      is_required: {
        type: DataTypes.BOOLEAN,
        comment: '2=>InActive,1=>Active',
        defaultValue: 1,
        get() {
          if (this.getDataValue('is_required') === true) return 1;
          return this.getDataValue('is_required');
        },
      },
      type: {
        type: DataTypes.BOOLEAN,
        comment:
          '1=>Intake,2=>Business,3=>Formulary,4=>Checkout,5=>Patient register,6=>Patient insurance',
        defaultValue: 1,
        get() {
          if (this.getDataValue('type') === true) return 1;
          return this.getDataValue('type');
        },
      },
      question_type: {
        type: DataTypes.BOOLEAN,
        comment:
          '1=>free text,2=>text area,3=>drop down,4=>radio button,5=>multiple choice,6=>upload,7=>date,8=>state drop down',
        defaultValue: 1,
        get() {
          if (this.getDataValue('question_type') === true) return 1;
          return this.getDataValue('question_type');
        },
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'users', key: 'user_id' },
      },
      formulary_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'formulary', key: 'formulary_id' },
      },
      old_question_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      sequence: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=Active 2=Inactive',
        defaultValue: 1,
        get() {
          if (this.getDataValue('status') === true) return 1;
          return this.getDataValue('status');
        },
      },
      created_by: {
        type: DataTypes.BOOLEAN,
        comment: '2=>Admin,1=>user',
        defaultValue: 1,
        get() {
          if (this.getDataValue('created_by') === true) return 1;
          return this.getDataValue('created_by');
        },
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
      modelName: 'Questions',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'questions',
      defaultScope: {
        attributes: {
          exclude: ['updated_at', 'deleted_at'],
        },
      },
      scopes: {
        businessQuestionColumns: {
          attributes: {
            exclude: ['user_id', 'formulary_id', 'old_formulary_id'],
          },
          where: {
            type: 2,
            status: 1,
            created_by: 2,
          },
        },
        intakeAdminQuestionColumns: {
          attributes: {
            exclude: ['formulary_id', 'old_formulary_id'],
          },
          where: {
            type: 1,
            status: 1,
            created_by: 2,
          },
        },
        intakeUserQuestionColumns: {
          attributes: {
            exclude: ['formulary_id', 'old_formulary_id'],
          },
          where: {
            type: 1,
            status: 1,
            created_by: 1,
          },
        },
        formulryUserQuestionColumns: {
          where: {
            type: 3,
            status: 1,
            created_by: 1,
          },
        },
        patientSignupQuestionsDetails: {
          attributes: {
            exclude: ['user_id', 'formulary_id', 'old_formulary_id'],
          },
          where: {
            type: 5,
            status: 1,
            created_by: 2,
          },
        },
        patientformulryUserQuestionColumns: {
          attributes: {
            exclude: [
              'user_id',
              'formulary_id',
              'old_formulary_id',
              'order_id',
            ],
          },
          where: {
            type: 3,
            status: 1,
            created_by: 1,
          },
        },
        patientCheckoutIntakeUserQuestionColumns: {
          attributes: {
            exclude: [
              'user_id',
              'formulary_id',
              'old_formulary_id',
              'order_id',
            ],
          },
          where: {
            type: 4,
            status: 1,
            created_by: 2,
          },
        },
        patientInsuranceQuestionsDetails: {
          attributes: {
            exclude: ['user_id', 'formulary_id', 'old_formulary_id'],
          },
          where: {
            type: 6,
            status: 1,
            created_by: 2,
          },
        },
      },
    }
  );
  sequelizePaginate.paginate(Questions);
  return Questions;
};
