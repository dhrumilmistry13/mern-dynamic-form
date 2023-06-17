const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const FilePath = require('../config/upload.config');
const { getFileUrl } = require('../helpers/s3file.helper');

module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      OrderStatusHistory,
      OrderItems,
      OrderAddress,
      OrganizationInfo,
      Users,
      UserCards,
      UserTransactions,
    }) {
      // define association here
      this.hasOne(OrderStatusHistory, {
        foreignKey: 'order_id',
        as: 'order_status_histories',
      });
      this.hasMany(OrderItems, {
        foreignKey: 'order_id',
        as: 'order_items',
      });
      this.hasMany(UserTransactions, {
        foreignKey: 'order_id',
        as: 'user_transactions',
      });
      this.hasMany(OrderAddress, {
        foreignKey: 'order_id',
        as: 'order_addresses',
      });
      this.belongsTo(OrganizationInfo, {
        foreignKey: 'user_id',
        as: 'organization_info',
      });
      this.belongsTo(UserCards, {
        foreignKey: 'card_id',
        as: 'user_cards',
      });
      this.belongsTo(Users, { foreignKey: 'user_id', as: 'users' });
    }
  }
  Orders.init(
    {
      order_id: {
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
        allowNull: true,
        references: { model: 'users', key: 'user_id' },
        defaultValue: null,
      },
      transaction_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      packing_shipping_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
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
      medication_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      payment_status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=>Paid,2=>Pending,3=>Failed,4=>Cancel',
        defaultValue: 2,
        get() {
          if (this.getDataValue('payment_status') === true) return 1;
          return this.getDataValue('payment_status');
        },
      },
      order_status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment:
          '1=>Draft,2=> Placed,3=> Rx Accepted,4=> Pharmacy order placed,5=> delivered,6=> Canceled',
        defaultValue: 1,
        get() {
          if (this.getDataValue('order_status') === true) return 1;
          return this.getDataValue('order_status');
        },
      },
      payout_status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=>Paid,2=>Pending',
        defaultValue: 2,
        get() {
          if (this.getDataValue('payout_status') === true) return 1;
          return this.getDataValue('payout_status');
        },
      },
      payout_note: {
        allowNull: true,
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      document_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null,
        async get() {
          if (this.getDataValue('document_id')) {
            const userTokenData = this.getDataValue('order_id');
            let folder_path = FilePath.getFolderConfig().document_id;
            folder_path = folder_path.file_path.replace(
              folder_path.replace,
              userTokenData
            );
            folder_path += this.getDataValue('document_id');
            const uploadURL = await getFileUrl(`${folder_path}`);
            return uploadURL;
            // return `${process.env.AWS_URL}/${folder_path}`;
          }
          return this.getDataValue('document_id');
        },
      },
      selfi_image: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null,
        async get() {
          if (this.getDataValue('selfi_image')) {
            const userTokenData = this.getDataValue('order_id');
            let folder_path = FilePath.getFolderConfig().selfi_image;
            folder_path = folder_path.file_path.replace(
              folder_path.replace,
              userTokenData
            );
            folder_path += this.getDataValue('selfi_image');
            const uploadURL = await getFileUrl(`${folder_path}`);
            return uploadURL;
            // return `${process.env.AWS_URL}/${folder_path}`;
          }
          return this.getDataValue('selfi_image');
        },
      },
      card_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null,
      },
      order_note: {
        allowNull: true,
        type: DataTypes.TEXT,
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
      modelName: 'Orders',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'orders',
      defaultScope: {
        attributes: {
          exclude: ['updated_at', 'deleted_at'],
        },
      },
    }
  );
  sequelizePaginate.paginate(Orders);
  return Orders;
};
