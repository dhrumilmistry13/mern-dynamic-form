const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrganizationStaffInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  OrganizationStaffInfo.init(
    {
      organization_staff_info_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      organation_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
        references: { model: 'users', key: 'user_id' },
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
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
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
        defaultValue: null,
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
        defaultValue: null,
      },
      dosespot_org_id: {
        type: DataTypes.BIGINT,
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
      modelName: 'OrganizationStaffInfo',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      tableName: 'organization_staff_infos',
    }
  );
  return OrganizationStaffInfo;
};
