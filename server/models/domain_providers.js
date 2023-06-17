'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class domain_providers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  domain_providers.init({
    domain_provider_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      comment: '1=>Active,2=>Inactive',
      defaultValue: 1,
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
  }, {
    sequelize,
      modelName: 'domain_providers',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'domain_providers',
  });
  return domain_providers;
};