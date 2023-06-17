const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrgSlots extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  OrgSlots.init(
    {
      org_slot_id: {
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
      org_availabilities_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'org_availabilities',
          key: 'org_availabilities_id',
        },
      },
      day: {
        type: DataTypes.BOOLEAN,
        comment: '1=>mon,2=>tue,3=>wed,4=>thu,5=>fri,6=>sat,7=>sun',
        defaultValue: 1,
        get() {
          if (this.getDataValue('day') === true) return 1;
          return this.getDataValue('day');
        },
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
      modelName: 'OrgSlots',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'org_slot',
    }
  );
  return OrgSlots;
};
