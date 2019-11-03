module.exports = (sequelize, DataTypes) => {
    return sequelize.define('sensor', {
      SENSOR_IDX: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      PLACE_IDX: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      SENSOR_NAME: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      SENSOR_OPTION: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      SENSOR_TOKEN: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      REG_DE: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('now()'),
      },
      UPDATE_DE: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('now()'),
      }
    }, {
      timestamps: false,
      tableName : 'sensor'
    });
  };