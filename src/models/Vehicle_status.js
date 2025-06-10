module.exports = (sequelize, DataTypes) => {
  const VehicleStatus = sequelize.define(
    'VehicleStatus',
    {
      v_id: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      reg_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING(10),
        allowNull: true
      }
    },
    {
      tableName: 'vehicle_status_tbl',
      timestamps: false
    }
  );

  return VehicleStatus;
};