module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('order_items', 'transitionrx_fill_id', {
      type: Sequelize.STRING(150),
      allowNull: true,
      defaultValue: null,
      after: 'pre_status',
    });
    await queryInterface.addColumn('order_items', 'transitionrx_fill_status', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: null,
      comment:
        '1=>Placed,2=>Replacement,3=>Shipped,4=>Cancelled,5=>Exception-Missing Rx,6=>Exception-Expired,7=>Exception-Too Soon,8=>Exception-DOB,9=>Exception-Name,10=>Exception-Address,11=>Exception-RX Confirmation,12=>Exception-Pending',
      after: 'shipped_date',
    });
  },
};
