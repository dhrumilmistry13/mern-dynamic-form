const Sequelize = require('sequelize');
const models = require('../../../models/index');
const {
  successResponse,
  errorResponse,
} = require('../../../helpers/response.helper');
const { storeNotification } = require('../../../helpers/notification.helper');
const { getFolderConfig } = require('../../../config/upload.config');
const { fileUploadUrl } = require('../../../helpers/s3file.helper');
const { translationTextMessage } = require('../../../helpers/common.helper');

class ChatController {
  /**
   * @name getPatientUserChatList
   * @description Get Chat User List.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getPatientUserChatList(req, res) {
    try {
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const getPatientChatRoom = await models.UserChatRoom.findOne({
        attributes: [
          'user_chat_room_id',
          'organization_id',
          'user_id',
          'created_at',
        ],
        include: [
          {
            model: models.Users,
            as: 'users',
            require: false,
            attributes: ['user_id', 'first_name', 'last_name', 'profile_image'],
          },
        ],
        group: ['user_chat_room_id'],
        where: {
          organization_id: organizationData.user_id,
        },
        order: [
          [Sequelize.col('latest_message_date'), 'DESC'],
          ['created_at', 'Desc'],
        ],
      });
      const data = getPatientChatRoom.dataValues;
      const getChatData = await models.UserChat.findOne({
        where: {
          user_chat_room_id: getPatientChatRoom.user_chat_room_id,
        },
        order: [['user_chat_id', 'DESC']],
      });
      data.user_chat = getChatData && getChatData.dataValues;
      if (getChatData) {
        data.user_chat.type_message = getChatData.type_message;
        data.user_chat.is_seen = getChatData.is_seen;
      }
      data.users = getPatientChatRoom.users.dataValues;
      data.users.profile_image =
        await getPatientChatRoom.users.profile_image.then((dataUrl) => dataUrl);
      return setTimeout(async () => {
        successResponse(req, res, 'admin.get_organization_chat_list', data);
      }, 500);
    } catch (error) {
      return errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationUserChatList
   * @description Get Chat User List.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getOrganizationUserChatList(req, res) {
    try {
      const { search_text } = req.query;
      const { user } = req.payload;
      const user_id = user.organization_id
        ? user.organization_id
        : user.user_id;
      const whereCondition = {};
      if (search_text) {
        whereCondition.where = Sequelize.where(
          Sequelize.fn(
            'concat',
            Sequelize.col('first_name'),
            ' ',
            Sequelize.col('last_name')
          ),
          {
            [Sequelize.Op.like]: `%${search_text}%`,
          }
        );
      }
      const userList = await models.UserChatRoom.findAll({
        attributes: [
          'user_chat_room_id',
          'organization_id',
          'user_id',
          'created_at',
          [
            Sequelize.literal(
              `(SELECT MAX(UserChat.created_at) FROM user_chat AS UserChat WHERE UserChat.user_chat_room_id=UserChatRoom.user_chat_room_id)`
            ),
            'latest_message_date',
          ],
          [
            Sequelize.literal(
              `(SELECT (UserChat.user_chat_id) FROM user_chat AS UserChat WHERE UserChat.user_chat_room_id=UserChatRoom.user_chat_room_id ORDER BY UserChat.user_chat_id DESC LIMIT 1)`
            ),
            'latest_message_id',
          ],
          [
            Sequelize.literal(
              `(SELECT count(UserChat.created_at) FROM user_chat AS UserChat WHERE UserChat.user_chat_room_id=UserChatRoom.user_chat_room_id and UserChat.to_user_id=${user_id} and is_seen=1)`
            ),
            'unread_count',
          ],
        ],
        include: [
          {
            model: models.Users,
            as: 'users',
            require: true,
            attributes: ['user_id', 'first_name', 'last_name', 'profile_image'],
            where: whereCondition,
          },
        ],
        group: ['user_chat_room_id'],
        where: {
          organization_id: user_id,
        },
        order: [
          [Sequelize.col('latest_message_date'), 'DESC'],
          ['created_at', 'Desc'],
        ],
        having: Sequelize.literal(`latest_message_id!=''`),
      });
      const dataList = [];
      userList.forEach(async (value, index) => {
        const data = value.dataValues;
        const getChatData = await models.UserChat.findOne({
          where: {
            user_chat_room_id: value.user_chat_room_id,
          },
          order: [['user_chat_id', 'DESC']],
        });
        data.user_chat = getChatData && getChatData.dataValues;
        if (getChatData) {
          data.user_chat.type_message = getChatData.type_message;
          data.user_chat.is_seen = getChatData.is_seen;
        }
        data.users = value.users.dataValues;
        data.users.profile_image = await value.users.profile_image.then(
          (dataUrl) => dataUrl
        );
        dataList[index] = data;
      });
      return setTimeout(async () => {
        successResponse(req, res, 'admin.get_organization_chat_list', dataList);
      }, 500);
    } catch (error) {
      return errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationUserChatListSearch
   * @description Get Chat User List Search.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getOrganizationUserChatListSearch(req, res) {
    try {
      const { search_text } = req.query;
      const { user } = req.payload;
      const user_id = user.organization_id
        ? user.organization_id
        : user.user_id;
      const whereCondition = {};
      let userList = '';
      const userChatRoom = await models.UserChatRoom.findAll({
        attributes: ['user_id'],
        where: {
          organization_id: user_id,
        },
      });
      const charRoomUserId = userChatRoom.map(
        (value) => value.dataValues.user_id
      );
      if (search_text) {
        whereCondition.where = Sequelize.where(
          Sequelize.fn(
            'concat',
            Sequelize.col('first_name'),
            ' ',
            Sequelize.col('last_name')
          ),
          {
            [Sequelize.Op.like]: `%${search_text}%`,
          }
        );
        whereCondition.organation_id = user_id;
        whereCondition.user_id = {
          [Sequelize.Op.notIn]: charRoomUserId,
        };
        userList = await models.Users.findAll({
          attributes: ['user_id', 'first_name', 'last_name', 'profile_image'],
          where: whereCondition,
        });
      }
      const dataList = [];
      if (userList) {
        userList.forEach(async (value, index) => {
          const data = value.dataValues;
          data.profile_image = await value.profile_image.then(
            (dataUrl) => dataUrl
          );
          dataList[index] = data;
        });
      }
      return setTimeout(async () => {
        successResponse(req, res, 'admin.get_organization_chat_list', dataList);
      }, 500);
    } catch (error) {
      return errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationChatList
   * @description Get User Chat List.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getOrganizationChatList(req, res) {
    try {
      const { user_chat_room_id, page, type } = req.query;
      const { user_id } = req.payload.user;
      let org_chat_list = {
        docs: [],
        pages: 0,
        total: 0,
      };
      let getChatUserData;

      if (type === 'user') {
        getChatUserData = await models.Users.findOne({
          attributes: ['user_id', 'first_name', 'last_name', 'profile_image'],
          where: {
            user_id: user_chat_room_id,
          },
        });
      }
      if (type === 'room') {
        getChatUserData = await models.UserChatRoom.findOne({
          attributes: [
            'user_chat_room_id',
            'organization_id',
            'user_id',
            'created_at',
          ],
          include: [
            {
              model: models.Users,
              as: 'users',
              require: false,
              attributes: [
                'user_id',
                'first_name',
                'last_name',
                'profile_image',
              ],
            },
          ],
          where: {
            user_chat_room_id,
          },
          order: [['created_at', 'DESC']],
        });

        await models.UserChat.update(
          { is_seen: 2 },
          {
            where: {
              user_chat_room_id,
              to_user_id: user_id,
            },
          }
        );
        org_chat_list = await models.UserChat.paginate({
          where: {
            user_chat_room_id,
          },
          include: [
            {
              model: models.Users,
              as: 'from_users',
              paranoid: false,
              attributes: [
                'user_id',
                'first_name',
                'last_name',
                'profile_image',
                'user_type',
                'organation_id',
              ],
            },
            {
              model: models.Users,
              as: 'to_users',
              paranoid: false,
              attributes: [
                'user_id',
                'first_name',
                'last_name',
                'profile_image',
                'user_type',
                'organation_id',
              ],
            },
          ],
          page: 1,
          paginate: page * 5,
          order: [['user_chat_id', 'DESC']],
        });
      }
      let ChatUserData = {};
      if (getChatUserData && type === 'room') {
        ChatUserData = getChatUserData.dataValues;
        ChatUserData.user_chat =
          getChatUserData.user_chat && getChatUserData.user_chat.dataValues;

        ChatUserData.users = getChatUserData.users.dataValues;
        ChatUserData.users.profile_image =
          await getChatUserData.users.profile_image.then((dataUrl) => dataUrl);
      }
      if (getChatUserData && type === 'user') {
        ChatUserData.users = getChatUserData.dataValues;
        ChatUserData.users.profile_image =
          await getChatUserData.profile_image.then((dataUrl) => dataUrl);
      }

      const userChatListData = await Promise.all(
        org_chat_list.docs.map(async (value) => {
          const data = value.dataValues;
          data.is_seen = value.is_seen;
          data.type_message = value.type_message;
          data.image_path = await value.image_path.then((dataUrl) => dataUrl);
          data.from_users.dataValues.from_profile_image =
            await value.from_users.profile_image.then((dataUrl) => dataUrl);
          data.to_users.dataValues.to_profile_image =
            await value.to_users.profile_image.then((dataUrl) => dataUrl);
          return data;
        })
      );
      return setTimeout(async () => {
        successResponse(req, res, 'admin.get_organization_chat_list', {
          user_room: ChatUserData,
          user_chat_list: userChatListData,
          pagination: {
            total: org_chat_list.total,
            count: org_chat_list.docs.length,
            current_page: page,
            last_page: org_chat_list.pages,
            per_page: 2,
            hasMorePages: org_chat_list.pages > parseInt(page, 10),
          },
        });
      }, 500);
    } catch (error) {
      return errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientChatList
   * @description Get User Chat List.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getPatientChatList(req, res) {
    try {
      const { page } = req.query;
      const { user_id } = req.payload.user;
      const getChatUserData = await models.UserChatRoom.findOne({
        attributes: [
          'user_chat_room_id',
          'organization_id',
          'user_id',
          'created_at',
        ],
        include: [
          {
            model: models.Users,
            as: 'users',
            require: false,
            attributes: ['user_id', 'first_name', 'last_name', 'profile_image'],
          },
        ],
        where: {
          user_id,
        },
        order: [['created_at', 'DESC']],
      });

      let ChatUserData = {};
      let userChatListData = [];
      if (getChatUserData) {
        ChatUserData = getChatUserData.dataValues;
        ChatUserData.user_chat =
          getChatUserData.user_chat && getChatUserData.user_chat.dataValues;

        ChatUserData.users = getChatUserData.users.dataValues;
        ChatUserData.users.profile_image =
          await getChatUserData.users.profile_image.then((dataUrl) => dataUrl);

        const { docs, pages, total } = await models.UserChat.paginate({
          where: {
            user_chat_room_id: getChatUserData
              ? getChatUserData.user_chat_room_id
              : 0,
          },
          include: [
            {
              model: models.Users,
              as: 'from_users',
              paranoid: false,
              attributes: [
                'user_id',
                'first_name',
                'last_name',
                'profile_image',
                'user_type',
                'organation_id',
              ],
            },
            {
              model: models.Users,
              as: 'to_users',
              paranoid: false,
              attributes: [
                'user_id',
                'first_name',
                'last_name',
                'profile_image',
                'user_type',
                'organation_id',
              ],
            },
          ],
          page: 1,
          paginate: page * 5,
          order: [['user_chat_id', 'DESC']],
        });
        userChatListData = await Promise.all(
          docs.map(async (value) => {
            const data = value.dataValues;
            data.is_seen = value.is_seen;
            data.type_message = value.type_message;
            data.image_path = await value.image_path.then((dataUrl) => dataUrl);
            data.from_users.dataValues.from_profile_image =
              await value.from_users.profile_image.then((dataUrl) => dataUrl);
            data.to_users.dataValues.to_profile_image =
              await value.to_users.profile_image.then((dataUrl) => dataUrl);
            // docs[index] = data;
            return data;
          })
        );

        await models.UserChat.update(
          { is_seen: 2 },
          {
            where: {
              to_user_id: user_id,
            },
          }
        );
        return setTimeout(async () => {
          successResponse(req, res, 'admin.get_organization_chat_list', {
            user_room: ChatUserData,
            user_chat_list: userChatListData,
            pagination: {
              total: total || 0,
              count: docs.length,
              current_page: page,
              last_page: pages,
              per_page: 2,
              hasMorePages: pages > parseInt(page, 10),
            },
          });
        }, 500);
      }
      return setTimeout(async () => {
        successResponse(req, res, 'admin.get_organization_chat_list', {
          user_room: ChatUserData,
          user_chat_list: userChatListData,
          pagination: {
            total: 0,
            count: 0,
            current_page: page,
            last_page: 0,
            per_page: 2,
            hasMorePages: false,
          },
        });
      }, 500);
    } catch (error) {
      return errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name userChatMessageSend
   * @description send Chat.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async userChatMessageSend(req, res) {
    try {
      const { to_user_id, from_user_id, message, type_message, type } =
        req.body;
      const uploadPromises = [];
      let { room_id } = req.body;
      room_id = parseInt(room_id, 10);
      let chatData = '';
      if (room_id === 0 || !room_id) {
        if (type === 'user') {
          chatData = await models.UserChatRoom.create({
            user_id: to_user_id,
            organization_id: from_user_id,
          });
        } else {
          chatData = await models.UserChatRoom.create({
            user_id: from_user_id,
            organization_id: to_user_id,
          });
        }
        if (!chatData) {
          throw new Error('admin.failed_to_chat_room_create');
        }
        room_id = chatData.user_chat_room_id;
      }
      const chatMessageData = {
        message: message || null,
        type_message: parseInt(type_message, 10),
        user_chat_room_id: parseInt(room_id, 10),
        from_user_id,
        is_seen: 1,
        to_user_id,
      };
      const messageSend = await models.UserChat.create(chatMessageData);
      if (!messageSend) {
        throw new Error('admin.chat_message_send_failed');
      } else if (req.files.length > 0) {
        const fileFolderPath = getFolderConfig().chat_file;
        const folder_path = fileFolderPath.file_path.replace(
          fileFolderPath.replace,
          messageSend.user_chat_id
        );
        const fileurl = await fileUploadUrl(req.files[0], folder_path);
        if (fileurl) {
          const pathArray = fileurl.filename.split('/');
          const file_name = pathArray[pathArray.length - 1];
          messageSend.image_path = file_name;
          messageSend.save();
        }

        uploadPromises.push(fileurl);
      }
      const message_title = translationTextMessage(
        'admin.message_notification_title'
      );
      const message_text = translationTextMessage(
        'admin.message_notification_text'
      );
      await storeNotification(message_title, message_text, to_user_id);
      return successResponse(
        req,
        res,
        'admin.user_message_send_success',
        {
          user_chat_room_id: room_id,
          to_user_id: parseInt(to_user_id, 10),
          uploadPromises,
        },
        200
      );
    } catch (error) {
      return errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrgUnreadMessageCount
   * @description unread message count.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getOrgUnreadMessageCount(req, res) {
    try {
      const { user_id } = req.payload.user;
      const { user_type, organation_id } = await models.Users.scope(
        'withUserTypeColumns'
      ).findOne({
        where: {
          user_id,
        },
      });
      const unreadMessageCount = await models.UserChat.count({
        where: {
          to_user_id: user_type === 4 ? organation_id : user_id,
          is_seen: 1,
        },
      });
      return successResponse(
        req,
        res,
        'admin.user_message_send_success',
        {
          unread_message_count: unreadMessageCount,
        },
        200
      );
    } catch (error) {
      return errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new ChatController();
