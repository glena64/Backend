module.exports = (sequelize, DataTypes) => {
  const Registration = sequelize.define('Registration', {
    reg_id: {
      type: DataTypes.STRING(20),
      primaryKey: true

    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    v_owner_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    v_org_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    v_org_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    v_owner_contact: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        is: /^[6-9]\d{9}$/ // Indian mobile format
      }
    },
    v_owner_address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_org: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    tableName: 'registration_tbl',
    timestamps: false
  });

  // ✅ Association setup
  Registration.associate = (models) => {
    Registration.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  Registration.associate = (models) => {
  Registration.hasMany(models.VehicleStatus, {
    foreignKey: 'reg_id',
    as: 'vehicleStatuses'
  });
};

  // ✅ Method to return safe object
  Registration.prototype.toSafeObject = function () {
    const { ...safeReg } = this.toJSON();
    return safeReg;
  };

  return Registration;
};
