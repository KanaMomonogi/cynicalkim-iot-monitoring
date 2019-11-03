module.exports = (sequelize, DataTypes) => {
    return sequelize.define('log', {
      LOG_IDX: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      SENSOR_IDX: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      TEMP: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      HUMI: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      REG_DE: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('now()'),
      },
    }, {
      timestamps: false,
      tableName : 'log'
    });
  };