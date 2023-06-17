module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'order_items',
      'transitionrx_prescription_id',
      {
        type: Sequelize.STRING(150),
        defaultValue: null,
        allow: null,
        after: 'sub_total',
      }
    );
    await queryInterface.addColumn('order_items', 'transitionrx_patient_id', {
      type: Sequelize.STRING(150),
      defaultValue: null,
      allow: null,
      after: 'transitionrx_prescription_id',
    });
    await queryInterface.addColumn('order_items', 'rx_number', {
      type: Sequelize.STRING(150),
      defaultValue: null,
      allow: null,
      after: 'transitionrx_patient_id',
    });
    await queryInterface.addColumn('order_items', 'pre_status', {
      type: Sequelize.BOOLEAN,
      defaultValue: null,
      allow: null,
      comment:
        '1=>Pending-Patient Contact,2=>Pending-Patient Contact - Insurance,3=>Pending-Patient Contact – Shipping/Payment,4=>Processed Shipped,5=>Shipped,6=>Closed-Patient Cancelled,7=>Closed-Patient No Response,8=>Closed-Patient Declined Therapy,9=>Closed-Prescriber No Response,10=>Closed-Prescriber Cancelled Therapy',
      after: 'rx_number',
    });
    await queryInterface.addColumn('order_items', 'tracking_number', {
      type: Sequelize.STRING(150),
      defaultValue: null,
      allow: null,
      after: 'pre_status',
    });
    await queryInterface.addColumn('order_items', 'shipped_date', {
      type: Sequelize.DATEONLY,
      defaultValue: null,
      allow: null,
      after: 'tracking_number',
    });
    await queryInterface.addColumn('patient_info', 'transitionrx_patient_id', {
      type: Sequelize.STRING(150),
      defaultValue: null,
      allow: null,
      after: 'dosespot_patient_id',
    });
  },
};
