const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const FilePath = require('../config/upload.config');
const { getFileUrl } = require('../helpers/s3file.helper');

module.exports = (sequelize, DataTypes) => {
  class Formulary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ FormularyImage, Questions }) {
      // define association here
      this.hasMany(FormularyImage, {
        foreignKey: 'formulary_id',
        as: 'formulary_image',
      });
      this.hasMany(Questions, {
        foreignKey: 'formulary_id',
        as: 'questions',
      });
    }
  }
  Formulary.init(
    {
      formulary_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      dosage_amount: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      ndc: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      featured_image: {
        type: DataTypes.STRING(150),
        allowNull: true,
        async get() {
          // get() {
          if (this.getDataValue('featured_image')) {
            const userTokenData = this.getDataValue('formulary_id');
            let folder_path = FilePath.getFolderConfig().featured_image;
            folder_path = folder_path.file_path.replace(
              folder_path.replace,
              userTokenData
            );
            folder_path += this.getDataValue('featured_image');
            const uploadURL = await getFileUrl(`${folder_path}`);
            return uploadURL;
            // return `${process.env.AWS_URL}/${folder_path}`;
          }
          return this.getDataValue('featured_image');
        },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      short_description: {
        type: DataTypes.TEXT('medium'),
        allowNull: true,
      },
      sequence: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=Active 2=Inactive',
        defaultValue: 1,
        get() {
          if (this.getDataValue('status') === true) return 1;
          return this.getDataValue('status');
        },
      },
      is_appointment_required: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=>Yes 2=>No',
        defaultValue: 2,
        get() {
          if (this.getDataValue('is_appointment_required') === true) return 1;
          return this.getDataValue('is_appointment_required');
        },
      },
      packing_shipping_fee: {
        type: DataTypes.DECIMAL(5, 2),
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
      deleted_at: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: 'Formulary',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'formulary',
      defaultScope: {
        attributes: {
          exclude: ['updated_at', 'deleted_at'],
        },
      },
      scopes: {
        getFormularyData: {
          attributes: {
            exclude: ['status'],
          },
          where: {
            status: 1,
          },
        },
      },
    }
  );
  sequelizePaginate.paginate(Formulary);
  return Formulary;
};
