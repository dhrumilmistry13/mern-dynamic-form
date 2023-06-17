const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderAddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ States }) {
      this.belongsTo(States, {
        foreignKey: 'state_id',
        as: 'states',
      });
    }
  }
  OrderAddress.init(
    {
      order_address_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      order_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'orders', key: 'order_id' },
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
      },
      organization_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'users', key: 'user_id' },
        defaultValue: null,
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null,
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null,
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null,
      },
      country_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'countries', key: 'country_id' },
        defaultValue: null,
      },
      phone: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: null,
      },
      address: {
        allowNull: true,
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      city: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: null,
      },
      state_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'states', key: 'state_id' },
        defaultValue: null,
      },
      zipcode: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: null,
      },
      is_billing_same: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=>Yes,2=>No',
        defaultValue: 2,
        get() {
          if (this.getDataValue('is_billing_same') === true) return 1;
          return this.getDataValue('is_billing_same');
        },
      },
      type: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=>Shipping,2=>Billing',
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
      modelName: 'OrderAddress',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      tableName: 'order_addresses',
    }
  );
  return OrderAddress;
};
