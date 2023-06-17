const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class Translations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Translations.init(
    {
      translation_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      group: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      key: {
        type: DataTypes.STRING(191),
        allowNull: false,
        unique: true,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
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
    },
    {
      sequelize,
      modelName: 'Translations',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      tableName: 'translations',
    }
  );
  sequelizePaginate.paginate(Translations);
  return Translations;
};
