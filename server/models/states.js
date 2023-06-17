const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class States extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  States.init(
    {
      state_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      country_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'countries', key: 'country_id' },
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      short_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      sequence: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=Active 2=Inactive',
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
      modelName: 'States',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'states',
      defaultScope: {
        attributes: {
          exclude: ['updated_at', 'deleted_at'],
        },
      },
      scopes: {
        active: {
          where: {
            deleted_at: null,
            status: '1',
          },
        },
        getStateData: {
          attributes: {
            exclude: ['country_id', 'status'],
          },
          where: {
            status: 1,
          },
        },
      },
    }
  );
  sequelizePaginate.paginate(States);
  return States;
};
