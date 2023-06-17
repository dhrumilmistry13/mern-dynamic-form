const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class OrganizationFormulary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Formulary }) {
      this.belongsTo(Formulary, {
        foreignKey: 'formulary_id',
        as: 'formulary',
      });
    }
  }
  OrganizationFormulary.init(
    {
      organization_formulary_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      organization_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'Users', key: 'user_id' },
      },
      formulary_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'formulary', key: 'formulary_id' },
      },
      prescription_product: {
        type: DataTypes.BOOLEAN,
        comment: '2=>No,1=>Yes',
        defaultValue: 2,
        get() {
          if (this.getDataValue('prescription_product') === true) return 1;
          return this.getDataValue('prescription_product');
        },
      },
      top_discount_product: {
        type: DataTypes.BOOLEAN,
        comment: '2=>No,1=>Yes',
        defaultValue: 2,
        get() {
          if (this.getDataValue('top_discount_product') === true) return 1;
          return this.getDataValue('top_discount_product');
        },
      },
      popular_product: {
        type: DataTypes.BOOLEAN,
        comment: '2=>No,1=>Yes',
        defaultValue: 2,
        get() {
          if (this.getDataValue('popular_product') === true) return 1;
          return this.getDataValue('popular_product');
        },
      },
      margin: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true,
        defaultValue: 0,
      },
      patient_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
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
      modelName: 'OrganizationFormulary',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'organization_formulary',
    }
  );
  sequelizePaginate.paginate(OrganizationFormulary);
  return OrganizationFormulary;
};
