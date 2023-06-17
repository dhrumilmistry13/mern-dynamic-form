const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrgSpecificDateSlot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  OrgSpecificDateSlot.init(
    {
      org_specific_date_slot_id: {
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
      date: {
        allowNull: true,
        type: DataTypes.DATEONLY,
        defaultValue: null,
      },
      start_time: {
        allowNull: true,
        type: DataTypes.TIME,
        defaultValue: null,
      },
      end_time: {
        allowNull: true,
        type: DataTypes.TIME,
        defaultValue: null,
      },
      is_closed: {
        type: DataTypes.BOOLEAN,
        comment: '1=>Open,2=>Closed',
        defaultValue: 1,
        get() {
          if (this.getDataValue('is_closed') === true) return 1;
          return this.getDataValue('is_closed');
        },
      },
      is_booked: {
        type: DataTypes.BOOLEAN,
        comment: '1=>Not Book,2=>Booked',
        defaultValue: 1,
        get() {
          if (this.getDataValue('is_booked') === true) return 1;
          return this.getDataValue('is_booked');
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
      modelName: 'OrgSpecificDateSlot',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'org_specific_date_slot',
    }
  );
  return OrgSpecificDateSlot;
};
