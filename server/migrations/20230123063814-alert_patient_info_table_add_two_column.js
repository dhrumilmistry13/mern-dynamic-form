module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('patient_info', 'gender', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: null,
      comment: '(1:Male, 2: Female; 3: Unknown)',
      after: 'fill_step',
    });
    await queryInterface.addColumn('patient_info', 'dosespot_patient_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      defaultValue: null,
      after: 'gender',
    });
  },
};
