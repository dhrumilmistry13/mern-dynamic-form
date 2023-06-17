module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_item_status_histories', {
      order_item_status_history_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      order_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'orders', key: 'order_id' },
      },
      order_item_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'order_items', key: 'order_item_id' },
      },
      rx_status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: null,
        comment: '1=>pending,2=>Accept,3=>Reject,4=>Refunded,5=>Cancelled',
      },
      pre_status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: null,
        comment:
          '1=>Pending-Patient Contact,2=>Pending-Patient Contact - Insurance,3=>Pending-Patient Contact – Shipping/Payment,4=>Processed Shipped,5=>Shipped,6=>Closed-Patient Cancelled,7=>Closed-Patient No Response,8=>Closed-Patient Declined Therapy,9=>Closed-Prescriber No Response,10=>Closed-Prescriber Cancelled Therapy',
      },
      transitionrx_fill_status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: null,
        comment:
          '1=>Placed,2=>Replacement,3=>Shipped,4=>Cancelled,5=>Exception-Missing Rx,6=>Exception-Expired,7=>Exception-Too Soon,8=>Exception-DOB,9=>Exception-Name,10=>Exception-Address,11=>Exception-RX Confirmation,12=>Exception-Pending',
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
    await queryInterface.dropTable('order_item_status_histories');
  },
};