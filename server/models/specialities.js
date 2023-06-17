const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class Specialities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ OrganizationSpecialities }) {
      this.hasMany(OrganizationSpecialities, {
        foreignKey: 'specialities_id',
        as: 'organization_specialities',
      });
    }
  }
  Specialities.init(
    {
      specialities_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
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
      modelName: 'Specialities',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      paranoid: true,
      tableName: 'specialities',
      defaultScope: {
        attributes: {
          exclude: ['updated_at', 'deleted_at'],
        },
      },
      scopes: {
        getSpecialitiesData: {
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
  sequelizePaginate.paginate(Specialities);
  return Specialities;
};
