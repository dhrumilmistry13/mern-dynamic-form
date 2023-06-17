const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class CMS extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  CMS.init(
    {
      cms_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      slug: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: '0=>InActive,1=>Active',
        defaultValue: 1,
        get() {
          if (this.getDataValue('is_active') === true) return 1;
          return this.getDataValue('is_active');
        },
      },
      seo_meta_title: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
      },
      seo_meta_desc: {
        type: DataTypes.STRING(155),
        allowNull: true,
        defaultValue: null,
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
      modelName: 'CMS',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      tableName: 'cms',
      defaultScope: {
        attributes: {
          exclude: ['created_at', 'updated_at'],
        },
      },
      scopes: {
        withSecretColumns: {
          attributes: { include: ['slug'] },
        },
      },
    }
  );
  sequelizePaginate.paginate(CMS);
  return CMS;
};
