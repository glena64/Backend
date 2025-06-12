module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define('Vehicle', {
    v_id: {
      type: DataTypes.STRING(10),
      primaryKey: true
    },
    v_owner_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    special_type: {
      type: DataTypes.ENUM('Ambulance', 'Mortuary Van'),
      allowNull: true
    },
    v_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    license_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    v_category: {
      type: DataTypes.ENUM('Commercial', 'Non-Commercial'),
      allowNull: false
    },
    commercial_type: {
      type: DataTypes.ENUM('Cargo', 'Passenger'),
      allowNull: true
    },
    v_type: {
      type: DataTypes.ENUM('Bus', '4-Wheeler', 'Special'),
      allowNull: true
    },
    registration_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isIn: [[0, 1]]
      }
    }
  }, {
    tableName: 'vehicle',
    timestamps: false
  });
  
  // ✅ Association setup
  Vehicle.associate = (models) => {
  Vehicle.hasMany(models.VehicleStatus, {
    foreignKey: 'v_id',
    as: 'vehicleStatuses'
  });
};


  // ✅ Optional cleanup method for response shaping
  Vehicle.prototype.toSafeObject = function () {
    const { ...safeVehicle } = this.toJSON();
    return safeVehicle;
  };

  // ⚠️ No associations needed (standalone table)
  return Vehicle;
};
