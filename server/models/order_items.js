const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Formulary, Orders, UserTransactions, Bookings }) {
      // define association here
      this.belongsTo(Formulary, {
        foreignKey: 'formulary_id',
        as: 'formulary',
      });
      this.belongsTo(Orders, {
        foreignKey: 'order_id',
        as: 'orders',
      });
      this.hasMany(UserTransactions, {
        foreignKey: 'order_item_id',
        as: 'user_transactions',
      });
      this.hasOne(Bookings, {
        foreignKey: 'order_item_id',
        as: 'bookings',
      });
    }
  }
  OrderItems.init(
    {
      order_item_id: {
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
      formulary_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'formulary', key: 'formulary_id' },
      },
      qty: {
        allowNull: true,
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      sub_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      medication_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      packing_shipping_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      rx_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1,
        comment: '1=>pending,2=>Accept,3=>Reject,4=>Refunded,5=>Cancelled',
        get() {
          if (this.getDataValue('rx_status') === true) return 1;
          return this.getDataValue('rx_status');
        },
      },
      transitionrx_prescription_id: {
        type: DataTypes.STRING(150),
        defaultValue: null,
        allow: null,
      },
      transitionrx_patient_id: {
        type: DataTypes.STRING(150),
        defaultValue: null,
        allow: null,
      },
      rx_number: {
        type: DataTypes.STRING(150),
        defaultValue: null,
        allow: null,
      },
      pre_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: null,
        allow: null,
        comment:
          '1=>Pending-Patient Contact,2=>Pending-Patient Contact - Insurance,3=>Pending-Patient Contact – Shipping/Payment,4=>Processed Shipped,5=>Shipped,6=>Closed-Patient Cancelled,7=>Closed-Patient No Response,8=>Closed-Patient Declined Therapy,9=>Closed-Prescriber No Response,10=>Closed-Prescriber Cancelled Therapy',
        get() {
          if (this.getDataValue('pre_status') === true) return 1;
          return this.getDataValue('pre_status');
        },
      },
      tracking_number: {
        type: DataTypes.STRING(150),
        defaultValue: null,
        allow: null,
      },
      shipped_date: {
        type: DataTypes.DATEONLY,
        defaultValue: null,
        allow: null,
      },
      transitionrx_fill_id: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null,
      },
      transitionrx_fill_status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null,
        comment:
          '1=>Placed,2=>Replacement,3=>Shipped,4=>Cancelled,5=>Exception-Missing Rx,6=>Exception-Expired,7=>Exception-Too Soon,8=>Exception-DOB,9=>Exception-Name,10=>Exception-Address,11=>Exception-RX Confirmation,12=>Exception-Pending',
        get() {
          if (this.getDataValue('transitionrx_fill_status') === true) return 1;
          return this.getDataValue('transitionrx_fill_status');
        },
      },
      appointment_status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=>Required,2=>Scheduled,3=>Completed',
        defaultValue: null,
        get() {
          if (this.getDataValue('appointment_status') === true) return 1;
          return this.getDataValue('appointment_status');
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
      modelName: 'OrderItems',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'order_items',
    }
  );
  return OrderItems;
};
