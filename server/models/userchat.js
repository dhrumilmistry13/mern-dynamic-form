const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const { getFileUrl } = require('../helpers/s3file.helper');
const FilePath = require('../config/upload.config');

module.exports = (sequelize, DataTypes) => {
  class UserChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users }) {
      // define association here
      this.belongsTo(Users, { foreignKey: 'from_user_id', as: 'from_users' });
      this.belongsTo(Users, { foreignKey: 'to_user_id', as: 'to_users' });
    }
  }
  UserChat.init(
    {
      user_chat_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      from_user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
      },
      to_user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
      },
      user_chat_room_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'user_chat_room', key: 'user_chat_room_id' },
      },
      message: {
        allowNull: true,
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      image_path: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null,
        async get() {
          // get() {
          if (this.getDataValue('image_path')) {
            const userTokenData = this.getDataValue('user_chat_id');
            let folder_path = FilePath.getFolderConfig().chat_file;
            folder_path = folder_path.file_path.replace(
              folder_path.replace,
              userTokenData
            );
            folder_path += this.getDataValue('image_path');
            const uploadURL = await getFileUrl(`${folder_path}`);
            return uploadURL;
            // return `${process.env.AWS_URL}/${folder_path}`;
          }
          return this.getDataValue('image_path');
        },
      },
      type_message: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment:
          '1=>text,2=>image,3=>video,4=>refund,5=>charge,6=>RxStatus,7=>PreStatus,8=>FillStatus',
        defaultValue: 1,
        get() {
          if (this.getDataValue('type_message') === true) return 1;
          return this.getDataValue('type_message');
        },
      },
      is_seen: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=>NotSeen,2=>Seen',
        defaultValue: 1,
        get() {
          if (this.getDataValue('is_seen') === true) return 1;
          return this.getDataValue('is_seen');
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
      modelName: 'UserChat',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'user_chat',
    }
  );
  sequelizePaginate.paginate(UserChat);
  return UserChat;
};
