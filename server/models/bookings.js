const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class Bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users }) {
      // define association here
      this.belongsTo(Users, { foreignKey: 'user_id', as: 'users' });
      this.belongsTo(Users, {
        sourceKey: 'organation_id',
        foreignKey: 'organation_id',
        as: 'origination',
      });
    }
  }
  Bookings.init(
    {
      bookings_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      organation_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
      },
      org_slot_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null,
      },
      org_specific_date_slot_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null,
      },
      timezone_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
        references: { model: 'timezones', key: 'timezone_id' },
      },
      book_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null,
      },
      start_time: {
        allowNull: true,
        type: DataTypes.TIME,
        defaultValue: null,
        comment: 'slot start time',
      },
      end_time: {
        allowNull: true,
        type: DataTypes.TIME,
        defaultValue: null,
        comment: 'slot end time',
      },
      booking_status: {
        type: DataTypes.BOOLEAN,
        comment:
          '1=>Pending,2=>Accepted,3=>Rejected,4=>Completed,5=>No Show Both,6=>No show patient,7=>No show org,8=>Reschedule,9=>Cancel by System,10=>Cancel',
        defaultValue: 1,
        get() {
          if (this.getDataValue('booking_status') === true) return 1;
          return this.getDataValue('booking_status');
        },
      },
      booking_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      reason: {
        allowNull: true,
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      cancellation_by: {
        type: DataTypes.BOOLEAN,
        comment: '1=>patient,2=>org,3=>admin',
        defaultValue: null,
        allowNull: true,
        get() {
          if (this.getDataValue('cancellation_by') === true) return 1;
          return this.getDataValue('cancellation_by');
        },
      },
      cancellation_timestamp: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null,
      },
      patient_join_time: {
        allowNull: true,
        type: DataTypes.STRING,
        defaultValue: null,
      },
      patient_join_unique_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      org_join_time: {
        allowNull: true,
        type: DataTypes.STRING,
        defaultValue: null,
      },
      org_join_unique_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      order_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'orders', key: 'order_id' },
        defaultValue: null,
      },
      order_item_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'order_items', key: 'order_item_id' },
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
      modelName: 'Bookings',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'bookings',
    }
  );
  sequelizePaginate.paginate(Bookings);
  return Bookings;
};
