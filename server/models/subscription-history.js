const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class SubscriptionHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users }) {
      this.belongsTo(Users, { foreignKey: 'user_id', as: 'users' });
    }
  }
  SubscriptionHistory.init(
    {
      subscription_history_id: {
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
      card_no: {
        type: DataTypes.INTEGER,
        comment: 'card last 4 digit only we store',
        allowNull: true,
      },
      card_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      transaction_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      payment_status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=>Success,2=>Failed, 3=>Retry',
        defaultValue: 2,
        get() {
          if (this.getDataValue('payment_status') === true) return 1;
          return this.getDataValue('payment_status');
        },
      },

      subscription_status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=>Expired,2=>Active,3=>Cancelled,4=>Renewed',
        get() {
          if (this.getDataValue('subscription_status') === true) return 1;
          return this.getDataValue('subscription_status');
        },
      },
      plan_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      plan_amount: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      cancelled_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'means subscription cancel date',
      },
      renewed_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'means expire date',
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
      modelName: 'SubscriptionHistory',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'subscription_history',
    }
  );
  sequelizePaginate.paginate(SubscriptionHistory);
  return SubscriptionHistory;
};
