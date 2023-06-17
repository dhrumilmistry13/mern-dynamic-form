const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

const FilePath = require('../config/upload.config');
const { getFileUrl } = require('../helpers/s3file.helper');

module.exports = (sequelize, DataTypes) => {
  // const Users = sequelize.define(
  //   'Users',
  //   {
  //     user_id: {
  //       allowNull: false,
  //       autoIncrement: true,
  //       primaryKey: true,
  //       type: DataTypes.INTEGER.UNSIGNED,
  //     },
  //     first_name: {
  //       type: DataTypes.STRING(100),
  //       allowNull: false,
  //     },
  //     last_name: {
  //       type: DataTypes.STRING(100),
  //       allowNull: false,
  //     },
  //     email: {
  //       type: DataTypes.STRING(150),
  //       allowNull: false,
  //     },
  //     country_id: {
  //       type: DataTypes.INTEGER.UNSIGNED,
  //       allowNull: true,
  //       references: { model: 'countries', key: 'country_id' },
  //     },
  //     phone: {
  //       type: DataTypes.STRING(30),
  //       allowNull: true,
  //     },
  //     password: {
  //       type: DataTypes.STRING(150),
  //       allowNull: true,
  //       defaultValue: null,
  //     },
  //     profile_image: {
  //       type: DataTypes.STRING(155),
  //       allowNull: true,
  //       defaultValue: null,
  //       async get() {
  //         // get() {
  //         if (this.getDataValue('profile_image')) {
  //           const userTokenData = this.getDataValue('user_id');
  //           let folder_path = FilePath.getUserImagePath();
  //           folder_path = folder_path.replace('{user_id}', userTokenData);
  //           folder_path += this.getDataValue('profile_image');
  //           const uploadURL = await getFileUrl(`${folder_path}`);
  //           return uploadURL;
  //           // return `${process.env.AWS_URL}/${folder_path}`;
  //         }
  //         return this.getDataValue('profile_image');
  //       },
  //     },
  //     organation_id: {
  //       type: DataTypes.INTEGER,
  //       allowNull: true,
  //       defaultValue: null,
  //     },
  //     account_type: {
  //       type: DataTypes.BOOLEAN,
  //       allowNull: true,
  //       comment: '1=>Email,2=>google,3=>facebook',
  //       defaultValue: 1,
  //       get() {
  //         if (this.getDataValue('account_type') === true) return 1;
  //         return this.getDataValue('account_type');
  //       },
  //     },
  //     user_type: {
  //       type: DataTypes.BOOLEAN,
  //       allowNull: true,
  //       comment: '1=>Admin,2=>Organization,3=>Patient',
  //       defaultValue: 1,
  //       get() {
  //         if (this.getDataValue('user_type') === true) return 1;
  //         return this.getDataValue('user_type');
  //       },
  //     },
  //     is_email_verified: {
  //       type: DataTypes.BOOLEAN,
  //       allowNull: true,
  //       comment: '1=>verified,2=>Not verified',
  //       defaultValue: 2,
  //       get() {
  //         if (this.getDataValue('is_email_verified') === true) return 1;
  //         return this.getDataValue('is_email_verified');
  //       },
  //     },
  //     is_fb_email_verify: {
  //       type: DataTypes.BOOLEAN,
  //       allowNull: true,
  //       comment: '1=Yes,2=No',
  //       defaultValue: 2,
  //       get() {
  //         if (this.getDataValue('is_fb_email_verify') === true) return 1;
  //         return this.getDataValue('is_fb_email_verify');
  //       },
  //     },
  //     facebook_id: {
  //       type: DataTypes.STRING(100),
  //       allowNull: true,
  //       defaultValue: null,
  //     },
  //     is_gmail_email_verify: {
  //       type: DataTypes.BOOLEAN,
  //       allowNull: true,
  //       comment: '1=Yes,2=No',
  //       defaultValue: 2,
  //       get() {
  //         if (this.getDataValue('is_gmail_email_verify') === true) return 1;
  //         return this.getDataValue('is_gmail_email_verify');
  //       },
  //     },
  //     gmail_id: {
  //       type: DataTypes.STRING(40),
  //       allowNull: true,
  //       defaultValue: null,
  //     },
  //     email_otp: {
  //       type: DataTypes.STRING(6),
  //       allowNull: true,
  //       defaultValue: null,
  //     },
  //     otp_expire_time: {
  //       allowNull: true,
  //       type: DataTypes.DATE,
  //       defaultValue: null,
  //     },
  //     reason: {
  //       allowNull: true,
  //       type: DataTypes.TEXT,
  //       defaultValue: null,
  //     },
  //     user_reason: {
  //       allowNull: true,
  //       type: DataTypes.TEXT,
  //       defaultValue: null,
  //     },
  //     admin_status: {
  //       type: DataTypes.BOOLEAN,
  //       allowNull: true,
  //       comment: '1=Active 2=Inactive',
  //       defaultValue: 1,
  //       get() {
  //         if (this.getDataValue('admin_status') === true) return 1;
  //         return this.getDataValue('admin_status');
  //       },
  //     },
  //     user_status: {
  //       type: DataTypes.BOOLEAN,
  //       allowNull: true,
  //       comment: '1=Active 2=Inactive,3=>Lockout',
  //       defaultValue: 1,
  //       get() {
  //         if (this.getDataValue('user_status') === true) return 1;
  //         return this.getDataValue('user_status');
  //       },
  //     },
  //     profile_setup: {
  //       type: DataTypes.BOOLEAN,
  //       comment: '1=>Complete,2=>Pending',
  //       defaultValue: 1,
  //       get() {
  //         if (this.getDataValue('profile_setup') === true) return 1;
  //         return this.getDataValue('profile_setup');
  //       },
  //     },
  //     dob: {
  //       type: DataTypes.DATEONLY,
  //       allowNull: true,
  //       defaultValue: null,
  //     },
  //     password_wrong_count: {
  //       type: DataTypes.BOOLEAN,
  //       defaultValue: 0,
  //       get() {
  //         if (this.getDataValue('password_wrong_count') === true) return 1;
  //         if (this.getDataValue('password_wrong_count') === false) return 0;
  //         return this.getDataValue('password_wrong_count');
  //       },
  //     },
  //     timezone_id: {
  //       type: DataTypes.INTEGER.UNSIGNED,
  //       allowNull: true,
  //       defaultValue: null,
  //       references: { model: 'timezones', key: 'timezone_id' },
  //     },
  //     created_at: {
  //       allowNull: true,
  //       type: DataTypes.DATE,
  //       defaultValue: null,
  //     },
  //     updated_at: {
  //       allowNull: true,
  //       type: DataTypes.DATE,
  //       defaultValue: null,
  //     },
  //     deleted_at: {
  //       allowNull: true,
  //       type: DataTypes.DATE,
  //       defaultValue: null,
  //     },
  //   },
  //   {
  //     modelName: 'Users',
  //     createdAt: 'created_at',
  //     updatedAt: 'updated_at',
  //     deletedAt: 'deleted_at',
  //     timestamps: true,
  //     paranoid: true,
  //     tableName: 'users',
  //     defaultScope: {
  //       attributes: {
  //         exclude: [
  //           'password',
  //           'is_fb_email_verify',
  //           'is_gmail_email_verify',
  //           'email_otp',
  //           'account_type',
  //           'user_type',
  //           'created_at',
  //           'updated_at',
  //           'deleted_at',
  //         ],
  //       },
  //     },
  //     scopes: {
  //       withSecretColumns: {
  //         attributes: {
  //           include: [
  //             'password',
  //             'user_type',
  //             'account_type',
  //             'is_email_verified',
  //             'is_fb_email_verify',
  //             'is_gmail_email_verify',
  //             'deleted_at',
  //           ],
  //         },
  //       },
  //       active: {
  //         where: {
  //           deleted_at: null,
  //         },
  //       },
  //       withUserTypeColumns: {
  //         attributes: { include: ['user_type'] },
  //       },
  //       getOrganizationProfileData: {
  //         where: {
  //           user_type: 2,
  //         },
  //       },
  //     },
  //   }
  // );
  // Users.associate = ({
  //   OrganizationInfo,
  //   PatientInfo,
  //   UserCards,
  //   Countries,
  //   Timezones,
  // }) => {
  //   Users.hasOne(OrganizationInfo, {
  //     foreignKey: 'user_id',
  //     as: 'organization_info',
  //   });
  //   Users.hasOne(PatientInfo, {
  //     foreignKey: 'user_id',
  //     as: 'patient_info',
  //   });
  //   Users.hasOne(UserCards, {
  //     foreignKey: 'user_id',
  //     as: 'user_cards',
  //   });
  //   Users.belongsTo(Users, {
  //     sourceKey: 'organation_id',
  //     foreignKey: 'organation_id',
  //     as: 'users',
  //   });
  //   Users.belongsTo(Countries, {
  //     foreignKey: 'country_id',
  //     as: 'countries',
  //   });
  //   Users.belongsTo(Timezones, {
  //     foreignKey: 'timezone_id',
  //     as: 'timezones',
  //   });
  // };

  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      OrganizationInfo,
      PatientInfo,
      UserCards,
      Countries,
      Timezones,
      OrganizationStaffInfo,
    }) {
      this.hasOne(OrganizationInfo, {
        foreignKey: 'user_id',
        as: 'organization_info',
      });
      this.hasOne(PatientInfo, {
        foreignKey: 'user_id',
        as: 'patient_info',
      });
      this.hasOne(UserCards, {
        foreignKey: 'user_id',
        as: 'user_cards',
      });
      this.belongsTo(Users, {
        sourceKey: 'organation_id',
        foreignKey: 'organation_id',
        as: 'users',
      });
      this.belongsTo(Countries, {
        foreignKey: 'country_id',
        as: 'countries',
      });
      this.belongsTo(Timezones, {
        foreignKey: 'timezone_id',
        as: 'timezones',
      });
      this.hasOne(OrganizationStaffInfo, {
        foreignKey: 'user_id',
        as: 'organization_staff_infos',
      });
    }
  }
  Users.init(
    {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      country_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'countries', key: 'country_id' },
      },
      phone: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null,
      },
      profile_image: {
        type: DataTypes.STRING(155),
        allowNull: true,
        defaultValue: null,
        async get() {
          // get() {
          if (this.getDataValue('profile_image')) {
            const userTokenData = this.getDataValue('user_id');
            let folder_path = FilePath.getUserImagePath();
            folder_path = folder_path.replace('{user_id}', userTokenData);
            folder_path += this.getDataValue('profile_image');
            const uploadURL = await getFileUrl(`${folder_path}`);
            return uploadURL;
            // return `${process.env.AWS_URL}/${folder_path}`;
          }
          return this.getDataValue('profile_image');
        },
      },
      organation_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      account_type: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=>Email,2=>google,3=>facebook',
        defaultValue: 1,
        get() {
          if (this.getDataValue('account_type') === true) return 1;
          return this.getDataValue('account_type');
        },
      },
      user_type: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=>Admin,2=>Organization,3=>Patient',
        defaultValue: 1,
        get() {
          if (this.getDataValue('user_type') === true) return 1;
          return this.getDataValue('user_type');
        },
      },
      is_email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=>verified,2=>Not verified',
        defaultValue: 2,
        get() {
          if (this.getDataValue('is_email_verified') === true) return 1;
          return this.getDataValue('is_email_verified');
        },
      },
      is_fb_email_verify: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=Yes,2=No',
        defaultValue: 2,
        get() {
          if (this.getDataValue('is_fb_email_verify') === true) return 1;
          return this.getDataValue('is_fb_email_verify');
        },
      },
      facebook_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null,
      },
      is_gmail_email_verify: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=Yes,2=No',
        defaultValue: 2,
        get() {
          if (this.getDataValue('is_gmail_email_verify') === true) return 1;
          return this.getDataValue('is_gmail_email_verify');
        },
      },
      gmail_id: {
        type: DataTypes.STRING(40),
        allowNull: true,
        defaultValue: null,
      },
      email_otp: {
        type: DataTypes.STRING(6),
        allowNull: true,
        defaultValue: null,
      },
      otp_expire_time: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null,
      },
      reason: {
        allowNull: true,
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      user_reason: {
        allowNull: true,
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      admin_status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=Active 2=Inactive',
        defaultValue: 1,
        get() {
          if (this.getDataValue('admin_status') === true) return 1;
          return this.getDataValue('admin_status');
        },
      },
      user_status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '1=Active 2=Inactive,3=>Lockout',
        defaultValue: 1,
        get() {
          if (this.getDataValue('user_status') === true) return 1;
          return this.getDataValue('user_status');
        },
      },
      profile_setup: {
        type: DataTypes.BOOLEAN,
        comment: '1=>Complete,2=>Pending',
        defaultValue: 1,
        get() {
          if (this.getDataValue('profile_setup') === true) return 1;
          return this.getDataValue('profile_setup');
        },
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null,
      },
      password_wrong_count: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        get() {
          if (this.getDataValue('password_wrong_count') === true) return 1;
          if (this.getDataValue('password_wrong_count') === false) return 0;
          return this.getDataValue('password_wrong_count');
        },
      },
      timezone_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
        references: { model: 'timezones', key: 'timezone_id' },
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
      modelName: 'Users',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      timestamps: true,
      paranoid: true,
      tableName: 'users',
      defaultScope: {
        attributes: {
          exclude: [
            'password',
            'is_fb_email_verify',
            'is_gmail_email_verify',
            'email_otp',
            'account_type',
            'user_type',
            'created_at',
            'updated_at',
            'deleted_at',
          ],
        },
      },
      scopes: {
        withSecretColumns: {
          attributes: {
            include: [
              'password',
              'user_type',
              'account_type',
              'is_email_verified',
              'is_fb_email_verify',
              'is_gmail_email_verify',
              'deleted_at',
            ],
          },
        },
        active: {
          where: {
            deleted_at: null,
          },
        },
        withUserTypeColumns: {
          attributes: { include: ['user_type'] },
        },
        getOrganizationProfileData: {
          where: {
            user_type: 2,
          },
        },
      },
    }
  );
  sequelizePaginate.paginate(Users);
  return Users;
};
