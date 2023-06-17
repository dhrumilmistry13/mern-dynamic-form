const { Model } = require('sequelize');
const { getFileUrl } = require('../helpers/s3file.helper');
const FilePath = require('../config/upload.config');

module.exports = (sequelize, DataTypes) => {
  class OrganizationSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  OrganizationSetting.init(
    {
      organization_setting_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'users', key: 'user_id' },
      },
      text_key: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      text_value: {
        type: DataTypes.TEXT,
        allowNull: false,
        async get() {
          if (
            (this.getDataValue('type') === 2 ||
              this.getDataValue('type') === 3) &&
            this.getDataValue('text_value') !== ''
          ) {
            let folder_path = '';
            const fileFolderPath =
              FilePath.getFolderConfig()[this.getDataValue('text_key')];
            folder_path = fileFolderPath.file_path.replace(
              fileFolderPath.replace,
              this.getDataValue('user_id')
            );
            folder_path += this.getDataValue('text_value');
            const uploadURL = await getFileUrl(`${folder_path}`);
            return uploadURL;
          }
          return this.getDataValue('text_value');
        },
      },
      type: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: '1=Text,2=Image,3=>Video',
        defaultValue: 1,
        get() {
          if (this.getDataValue('type') === true) return 1;
          return this.getDataValue('type');
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
      modelName: 'OrganizationSetting',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'organization_setting',
    }
  );
  return OrganizationSetting;
};
