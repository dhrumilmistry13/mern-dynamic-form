const { Model } = require('sequelize');
const FilePath = require('../config/upload.config');
const { getFileUrl } = require('../helpers/s3file.helper');

module.exports = (sequelize, DataTypes) => {
  class FormularyImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  FormularyImage.init(
    {
      formulary_image_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      formulary_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'formulary', key: 'formulary_id' },
      },
      image_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        async get() {
          // get() {
          if (this.getDataValue('image_name')) {
            const userTokenData = this.getDataValue('formulary_id');
            let folder_path = FilePath.getFolderConfig().formulary_image;
            folder_path = folder_path.file_path.replace(
              folder_path.replace,
              userTokenData
            );
            folder_path += this.getDataValue('image_name');
            const uploadURL = await getFileUrl(`${folder_path}`);
            return uploadURL;
            // return `${process.env.AWS_URL}/${folder_path}`;
          }
          return this.getDataValue('image_name');
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
      modelName: 'FormularyImage',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'formulary_image',
    }
  );
  return FormularyImage;
};
