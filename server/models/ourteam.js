const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const FilePath = require('../config/upload.config');
const { getFileUrl } = require('../helpers/s3file.helper');

module.exports = (sequelize, DataTypes) => {
  class OurTeam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  OurTeam.init(
    {
      our_team_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      designation: {
        type: DataTypes.STRING(155),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(155),
        allowNull: false,
        async get() {
          //  get() {
          if (this.getDataValue('image')) {
            const userTokenData = this.getDataValue('our_team_id');
            let folder_path =
              FilePath.getFolderConfig().our_team_image.file_path;
            folder_path = folder_path.replace('{our_team_id}', userTokenData);
            folder_path += this.getDataValue('image');
            const uploadURL = await getFileUrl(`${folder_path}`);
            return uploadURL;
            // return `${process.env.AWS_URL}/${folder_path}`;
          }
          return this.getDataValue('image');
        },
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: '1=Active 2=Inactive',
        defaultValue: 1,
        get() {
          if (this.getDataValue('is_active') === true) return 1;
          return this.getDataValue('is_active');
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
      modelName: 'OurTeam',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      paranoid: true,
      timestamps: true,
      tableName: 'our_team',
      defaultScope: {
        attributes: {
          exclude: ['created_at', 'updated_at', 'deleted_at'],
        },
      },
      scopes: {
        active: {
          where: {
            deleted_at: null,
          },
        },
      },
    }
  );
  sequelizePaginate.paginate(OurTeam);
  return OurTeam;
};
