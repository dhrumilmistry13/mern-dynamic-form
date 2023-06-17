/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('order_items', 'medication_cost', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
      after: 'sub_total',
    });
    await queryInterface.addColumn('order_items', 'packing_shipping_fee', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
      after: 'medication_cost',
    });
    await queryInterface.addColumn('order_items', 'appointment_status', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      comment:
        '1=>Pending,2=>Accepted,3=>Rejected,4=>Completed,5=>No Show Both,6=>No show patient,7=>No show org,8=>rescheduled,9=>Cancel by System,10=>Cancel',
      defaultValue: null,
    });
  },
};
