module.exports = (sequelize, DataTypes) => {
  const VehicleStatus = sequelize.define('VehicleStatus', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    v_id: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    reg_id: {
      type: DataTypes.STRING(20),
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
  }, {
    tableName: 'vehicle_status_tbl',
    timestamps: false
  });

 // ✅ Define the association method here
  VehicleStatus.associate = (models) => {
    VehicleStatus.belongsTo(models.Vehicle, {
      foreignKey: 'v_id',
      as: 'vehicle'
    });
  };

  return VehicleStatus;
};
