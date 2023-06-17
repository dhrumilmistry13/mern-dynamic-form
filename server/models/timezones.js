const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Timezones extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Timezones.init(
    {
      timezone_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
      },
      abbr: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '',
      },
      offset: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '',
      },
      isdst: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '',
      },
      utc: {
        type: DataTypes.STRING(150),
        allowNull: false,
        defaultValue: '',
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
      modelName: 'Timezones',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'timezones',
      defaultScope: {
        attributes: {
          exclude: ['created_at', 'updated_at', 'deleted_at'],
        },
      },
    }
  );
  return Timezones;
};
