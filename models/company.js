module.exports = (sequelize, DataTypes) => {
    return sequelize.define('company', {
      COMPANY_IDX: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      COMPANY_NAME: {
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
      tableName : 'company'
    });
  };