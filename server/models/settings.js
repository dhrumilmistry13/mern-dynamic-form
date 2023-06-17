const { Model } = require('sequelize');
const FilePath = require('../config/upload.config');
const { getFileUrl } = require('../helpers/s3file.helper');

module.exports = (sequelize, DataTypes) => {
  class Settings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Settings.init(
    {
      setting_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      text_key: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      text_value: {
        type: DataTypes.TEXT,
        allowNull: false,
        async get() {
          // get() {
          if (
            this.getDataValue('type') === 2 ||
            this.getDataValue('type') === 3
          ) {
            let folder_path = '';
            const fileFolderPath =
              FilePath.getFolderConfig()[this.getDataValue('text_key')];
            folder_path = fileFolderPath.file_path;

            folder_path += this.getDataValue('text_value');
            const uploadURL = await getFileUrl(`${folder_path}`);
            return uploadURL;
            // return `${process.env.AWS_URL}/${folder_path}${this.getDataValue(
            //   'text_value'
            // )}`;
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
    },
    {
      sequelize,
      modelName: 'Settings',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      tableName: 'settings',
    }
  );
  // Settings.prototype.gettext_value = async () => {
  //   if (this.getDataValue('type') === 2 || this.getDataValue('type') === 3) {
  //     let folder_path = '';
  //     const fileFolderPath =
  //       FilePath.getFolderConfig()[this.getDataValue('text_key')];
  //     folder_path = fileFolderPath.file_path;

  //     const url = await getFileUrl(
  //       `${folder_path}${this.getDataValue('text_value')}`
  //     ).then((res) => res);
  //     if (url) return url;
  //     return url;
  //     // return `${process.env.AWS_URL}/${folder_path}${this.getDataValue(
  //     //   'text_value'
  //     // )}`;
  //   }
  //   return this.getDataValue('text_value');
  // };
  return Settings;
};
