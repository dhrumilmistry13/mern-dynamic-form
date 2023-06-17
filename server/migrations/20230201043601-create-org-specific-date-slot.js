module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('org_specific_date_slot', {
      org_specific_date_slot_id: {
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
      date: {
        allowNull: true,
        type: Sequelize.DATEONLY,
        defaultValue: null,
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
      is_booked: {
        type: Sequelize.BOOLEAN,
        comment: '1=>Not Book,2=>Booked',
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
    await queryInterface.dropTable('org_specific_date_slot');
  },
};
