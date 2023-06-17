const { Model } = require('sequelize');
const FilePath = require('../config/upload.config');
const { getFileUrl } = require('../helpers/s3file.helper');

module.exports = (sequelize, DataTypes) => {
  class OrganizationInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ OrganizationSpecialities, Users }) {
      this.hasMany(OrganizationSpecialities, {
        foreignKey: 'organization_info_id',
        as: 'organization_specialities',
      });
      this.belongsTo(Users, {
        foreignKey: 'user_id',
        as: 'users',
      });
    }
  }
  OrganizationInfo.init(
    {
      organization_info_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
      },
      company_name: {
        type: DataTypes.STRING(155),
        allowNull: true,
      },
      subdomain_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
      },
      state_ids: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      header_logo: {
        type: DataTypes.STRING(50),
        allowNull: true,
        async get() {
          // get() {
          if (this.getDataValue('header_logo')) {
            const userTokenData = this.getDataValue('user_id');
            let folder_path = FilePath.getFolderConfig().header_logo;
            folder_path = folder_path.file_path.replace(
              folder_path.replace,
              userTokenData
            );
            folder_path += this.getDataValue('header_logo');
            const uploadURL = await getFileUrl(`${folder_path}`);
            return uploadURL;
            // return `${process.env.AWS_URL}/${folder_path}`;
          }
          return this.getDataValue('header_logo');
        },
      },
      footer_logo: {
        type: DataTypes.STRING(50),
        allowNull: true,
        async get() {
          // get() {
          if (this.getDataValue('footer_logo')) {
            const userTokenData = this.getDataValue('user_id');
            let folder_path = FilePath.getFolderConfig().footer_logo;
            folder_path = folder_path.file_path.replace(
              folder_path.replace,
              userTokenData
            );
            folder_path += this.getDataValue('footer_logo');
            const uploadURL = await getFileUrl(`${folder_path}`);
            return uploadURL;
            // return `${process.env.AWS_URL}/${folder_path}`;
          }
          return this.getDataValue('footer_logo');
        },
      },
      menu_text_color: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      button_icon_color: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      heading_color: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      text_color: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      background_color: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      primary_color: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      banner_text_color: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      card_no: {
        type: DataTypes.INTEGER,
        comment: 'card last 4 digit only we store',
        allowNull: true,
      },
      card_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      fill_step: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: `1=>How it's work,2=>Subscription,3=>Company Info Step 1,4=>Company Info Step 2,5=>Company Info Step 3,6=>intake form,7=>formulary`,
        defaultValue: 1,
        get() {
          if (this.getDataValue('fill_step') === true) return 1;
          return this.getDataValue('fill_step');
        },
      },
      fax_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
      },
      npi_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      city: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: null,
      },
      state: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: null,
      },
      postcode: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
      },
      country: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
      },
      dosespot_org_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null,
      },
      is_insurance_required: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 2,
        comment: '1=>on,2=>off',
        get() {
          if (this.getDataValue('is_insurance_required') === true) return 1;
          return this.getDataValue('is_insurance_required');
        },
      },
      doctor_visit_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      telemedicine_platform_fee: {
        type: DataTypes.DECIMAL(10, 2),
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
      modelName: 'OrganizationInfo',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'organization_info',
      defaultScope: {
        attributes: {
          exclude: ['created_at', 'updated_at', 'deleted_at'],
        },
      },
      scopes: {
        getOrganizationPracticeData: {
          attributes: {
            exclude: [
              'header_logo',
              'footer_logo',
              'menu_text_color',
              'primary_color',
              'button_icon_color',
              'heading_color',
              'text_color',
              'background_color',
              'card_no',
              'card_id',
              'fill_step',
            ],
          },
        },
        getOrganizationBrandColorData: {
          attributes: {
            exclude: [
              'company_name',
              'subdomain_name',
              'state_ids',
              'card_no',
              'card_id',
              'fill_step',
            ],
          },
        },
        getOrganizationData: {
          attributes: {
            exclude: [
              'subdomain_name',
              'state_ids',
              'header_logo',
              'footer_logo',
              'menu_text_color',
              'button_icon_color',
              'heading_color',
              'text_color',
              'background_color',
              'primary_color',
              'card_no',
              'card_id',
              'fill_step',
            ],
          },
        },
      },
    }
  );
  return OrganizationInfo;
};
