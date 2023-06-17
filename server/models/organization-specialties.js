const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrganizationSpecialities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Specialities }) {
      // define association here
      this.belongsTo(Specialities, {
        foreignKey: 'specialities_id',
        as: 'specialities',
      });
    }
  }
  OrganizationSpecialities.init(
    {
      organization_specialities_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      organization_info_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'organization_info', key: 'organization_info_id' },
      },
      specialities_type: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=specialities 2=Other',
        defaultValue: 1,
        get() {
          if (this.getDataValue('specialities_type') === true) return 1;
          return this.getDataValue('specialities_type');
        },
      },
      specialities_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'specialities', key: 'specialities_id' },
      },
      typespecialities_other_text: {
        type: DataTypes.STRING(50),
        allowNull: true,
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
      modelName: 'OrganizationSpecialities',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'organization_specialities',
      defaultScope: {
        attributes: {
          exclude: ['created_at', 'updated_at', 'deleted_at'],
        },
      },
    }
  );
  return OrganizationSpecialities;
};
