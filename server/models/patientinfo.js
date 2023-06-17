const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PatientInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  PatientInfo.init(
    {
      patient_info_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
      },
      fill_step: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: `1=>How it's work,2=>Basic Question,3=>insurance question`,
        defaultValue: 1,
        get() {
          if (this.getDataValue('fill_step') === true) return 1;
          return this.getDataValue('fill_step');
        },
      },
      gender: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null,
        comment: '(1:Male, 2: Female; 3: Unknown)',
        get() {
          if (this.getDataValue('gender') === true) return 1;
          return this.getDataValue('gender');
        },
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      city: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: null,
      },
      state: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: null,
      },
      postcode: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
      },
      country: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
      },
      dosespot_patient_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null,
      },
      transitionrx_patient_id: {
        type: DataTypes.STRING(150),
        defaultValue: null,
        allow: null,
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
      modelName: 'PatientInfo',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'patient_info',
      defaultScope: {
        attributes: {
          exclude: ['created_at', 'updated_at', 'deleted_at'],
        },
      },
    }
  );
  return PatientInfo;
};
