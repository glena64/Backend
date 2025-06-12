const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Route = sequelize.define('Route', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    trip_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    from: DataTypes.STRING,
    to: DataTypes.STRING
  });

  // ✅ Hook to auto-generate trip_id
  Route.beforeCreate((route, options) => {
    route.trip_id = `TRIP-${uuidv4()}`;
  });

  return Route;
};
