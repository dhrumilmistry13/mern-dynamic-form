const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class UserTransactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      OrderItems,
      Users,
      UserCards,
      Orders,
      OrganizationInfo,
    }) {
      // define association here
      this.belongsTo(OrderItems, {
        foreignKey: 'order_item_id',
        as: 'order_items',
      });
      this.belongsTo(UserCards, {
        foreignKey: 'user_card_id',
        as: 'user_cards',
      });
      this.belongsTo(Users, { foreignKey: 'user_id', as: 'users' });
      this.belongsTo(Orders, { foreignKey: 'order_id', as: 'orders' });
      this.belongsTo(UserTransactions, {
        foreignKey: 'order_id',
        as: 'user_transactions',
      });
      this.belongsTo(OrganizationInfo, {
        foreignKey: 'organization_id',
        as: 'organization_info',
      });
    }
  }
  UserTransactions.init(
    {
      user_transaction_id: {
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
      organization_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
      },
      order_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'orders', key: 'order_id' },
      },
      order_item_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'order_items', key: 'order_item_id' },
        defaultValue: null,
      },
      type: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=>Order,2=>Charge,3=>refund',
        defaultValue: 1,
        get() {
          if (this.getDataValue('type') === true) return 1;
          return this.getDataValue('type');
        },
      },
      payment_status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=>Paid,2=>Failed,3=>Cancel',
        defaultValue: 2,
        get() {
          if (this.getDataValue('payment_status') === true) return 1;
          return this.getDataValue('payment_status');
        },
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      refunded_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      ref_transaction_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
        references: { model: 'user_transactions', key: 'user_transaction_id' },
      },
      transaction_id: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null,
      },
      user_card_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'user_cards', key: 'user_card_id' },
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
      modelName: 'UserTransactions',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'user_transactions',
    }
  );
  sequelizePaginate.paginate(UserTransactions);
  return UserTransactions;
};
