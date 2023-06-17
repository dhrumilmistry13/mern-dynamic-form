const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserCards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users }) {
      // define association here
      this.belongsTo(Users, { foreignKey: 'user_id', as: 'users' });
    }
  }
  UserCards.init(
    {
      user_card_id: {
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
      card_id: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      pay_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      type: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: '1=>Master,2=>Visa,3=>American Express,4=>other',
        get() {
          if (this.getDataValue('type') === true) return 1;
          return this.getDataValue('type');
        },
      },
      card_last_digit: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: null,
      },
      expire_date: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=>Yes,2=>No',
        defaultValue: 2,
        get() {
          if (this.getDataValue('is_default') === true) return 1;
          return this.getDataValue('is_default');
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
      modelName: 'UserCards',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'user_cards',
    }
  );
  return UserCards;
};
