module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_chat', {
      user_chat_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      from_user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
      },
      to_user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
      },
      user_chat_room_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'user_chat_room', key: 'user_chat_room_id' },
      },
      message: {
        allowNull: true,
        type: Sequelize.TEXT,
        defaultValue: null,
      },
      image_path: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: null,
      },
      type_message: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment:
          '1=>text,2=>image,3=>video,4=>refund,5=>charge,6=>RxStatus,7=>PreStatus,8=>FillStatus',
        defaultValue: 1,
      },
      is_seen: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '1=>NotSeen,2=>Seen',
        defaultValue: 1,
      },
      created_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('user_chat');
  },
};
