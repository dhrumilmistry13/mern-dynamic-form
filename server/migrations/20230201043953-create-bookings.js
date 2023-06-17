module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookings', {
      bookings_id: {
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
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
      },
      org_slot_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: null,
      },
      org_specific_date_slot_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: null,
      },
      book_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        defaultValue: null,
      },
      start_time: {
        allowNull: true,
        type: Sequelize.TIME,
        defaultValue: null,
        comment: 'slot start time',
      },
      end_time: {
        allowNull: true,
        type: Sequelize.TIME,
        defaultValue: null,
        comment: 'slot end time',
      },
      booking_status: {
        type: Sequelize.BOOLEAN,
        comment:
          '1=>Pending,2=>Accepted,3=>Rejected,4=>Completed,5=>No Show Both,6=>No show patient,7=>No show org',
        defaultValue: 1,
      },
      reason: {
        allowNull: true,
        type: Sequelize.TEXT,
        defaultValue: null,
      },
      cancellation_by: {
        type: Sequelize.BOOLEAN,
        comment: '1=>patient,2=>org,3=>admin',
        defaultValue: null,
        allowNull: true,
      },
      cancellation_timestamp: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      patient_join_time: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      org_join_time: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
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
    await queryInterface.dropTable('bookings');
  },
};
