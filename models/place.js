module.exports = (sequelize, DataTypes) => {
    return sequelize.define('place', {
      PLACE_IDX: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      COMPANY_IDX: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      PLACE_NAME: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      REG_DE: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('now()'),
      }
    }, {
      timestamps: false,
      tableName : 'place'
    });
  };