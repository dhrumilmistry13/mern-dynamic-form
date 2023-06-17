'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_notes_attachments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  order_notes_attachments.init({
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'order_notes_attachments',
  });
  return order_notes_attachments;
};