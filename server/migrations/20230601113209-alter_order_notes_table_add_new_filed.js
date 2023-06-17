/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('order_notes', 'type', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      comment: '1=>text,2=>image,3=>video',
      defaultValue: 1,
      after: 'note',
    });
    await queryInterface.addColumn('order_notes', 'created_by', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null,
      references: { model: 'users', key: 'user_id' },
      after: 'type',
    });
  },
};
