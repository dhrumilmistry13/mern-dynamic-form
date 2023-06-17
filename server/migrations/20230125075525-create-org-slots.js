module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('org_slot', {
      org_slot_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      organation_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
      },
      org_availabilities_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'org_availabilities',
          key: 'org_availabilities_id',
        },
      },
      day: {
        type: Sequelize.BOOLEAN,
        comment: '1=>mon,2=>tue,3=>wed,4=>thu,5=>fri,6=>sat,7=>sun',
        defaultValue: 1,
      },
      start_time: {
        allowNull: true,
        type: Sequelize.TIME,
        defaultValue: null,
      },
      end_time: {
        allowNull: true,
        type: Sequelize.TIME,
        defaultValue: null,
      },
      is_closed: {
        type: Sequelize.BOOLEAN,
        comment: '1=>Open,2=>Closed',
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
    await queryInterface.dropTable('org_slot');
  },
};
