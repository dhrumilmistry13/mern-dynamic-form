const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderStatusHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  OrderStatusHistory.init(
    {
      order_status_history_id: {
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
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment:
          '1=>draft,2=>placed,3=>outofdelivery,4=>delivered,5=>cancelled',
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
      modelName: 'OrderStatusHistory',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      tableName: 'order_status_histories',
    }
  );
  return OrderStatusHistory;
};
