const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrgAvailabilities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  OrgAvailabilities.init(
    {
      org_availabilities_id: {
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
      is_date_range: {
        type: DataTypes.BOOLEAN,
        comment: '1=>Indefinitely,2=>date range',
        defaultValue: 1,
        get() {
          if (this.getDataValue('is_date_range') === true) return 1;
          return this.getDataValue('is_date_range');
        },
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
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
      modelName: 'OrgAvailabilities',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'org_availabilities',
    }
  );
  return OrgAvailabilities;
};
