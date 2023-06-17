const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Countries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Countries.init(
    {
      country_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(5),
        allowNull: false,
      },
      phone_code: {
        type: DataTypes.STRING(5),
        allowNull: false,
      },
      image_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: '1=Active 2=Inactive',
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
    },
    {
      sequelize,
      modelName: 'Countries',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'countries',
      defaultScope: {
        attributes: {
          exclude: ['created_at', 'updated_at', 'deleted_at'],
        },
      },
      scopes: {
        active: {
          where: {
            deleted_at: null,
            status: '1',
          },
        },
      },
    }
  );
  return Countries;
};
