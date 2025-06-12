const db = require('../models');
const User = db.User;
const Registration = db.Registration;
const Driver = db.Driver;
const DriverStatus = db.DriverStatus;
const Vehicle = db.Vehicle;
const VehicleStatus = db.VehicleStatus;

const JWTConfig = require('../config/jwt');
const LoginRequestDTO = require('../dto/request/LoginRequestDTO');
const RegisterRequestDTO = require('../dto/request/RegisterRequestDTO');
const RegistrationDto = require('../dto/request/RegistrationDto');
const VehicleDto = require('../dto/request/VehicleRequestDTO');
const DriverRequestDTO = require('../dto/request/DriverRequestDTO');
const DriverStatusRequestDTO = require('../dto/request/DriverStatusRequestDTO');
const VehicleStatusRequestDTO = require('../dto/request/VehicleStatusRequestDTO');
const AuthResponseDTO = require('../dto/response/AuthResponseDTO');
const VehicleStatusResponseDTO = require('../dto/response/VehicleStatusResponseDTO');
const RouteRequestDTO = require('../dto/request/RouteRequestDTO');
const RouteResponseDTO = require('../dto/response/RouteResponseDTO');
const { Route } = require('../models');
// const Route = db.Route; // Assuming Route model is defined in models

class AuthService {
  static async login(loginData) {
    const loginDTO = new LoginRequestDTO(loginData);
    const validation = loginDTO.validate();

   

    const user = await User.findOne({
      where: { email: loginDTO.email, isActive: true }
    });

    if (!user || !(await user.validatePassword(loginDTO.password))) {
      throw new Error('Invalid credentials');
    }

    user.lastLoginAt = new Date();

    const accessToken = JWTConfig.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const refreshToken = JWTConfig.generateRefreshToken({
      userId: user.id
    });

    user.refreshToken = refreshToken;
    await user.save();

    return new AuthResponseDTO(user, accessToken, refreshToken);
  }

  static async register(registerData) {
    const registerDTO = new RegisterRequestDTO(registerData);
    const validation = registerDTO.validate();

    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const existingUser = await User.findOne({
      where: { email: registerDTO.email }
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const user = await User.create({
      email: registerDTO.email,
      password: registerDTO.password,
      firstName: registerDTO.firstName,
      lastName: registerDTO.lastName
    });

    const accessToken = JWTConfig.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const refreshToken = JWTConfig.generateRefreshToken({
      userId: user.id
    });

    user.refreshToken = refreshToken;
    await user.save();

    return new AuthResponseDTO(user, accessToken, refreshToken);
  }

  static async registerNew(registerData) {
    const registerDTO = new RegistrationDto(registerData);
    const validation = registerDTO.validate();

    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const existingUser = await User.findOne({
      where: { email: registerDTO.email }
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const user = await User.create({
      email: registerDTO.email,
      password: registerDTO.password,
      firstName: registerDTO.firstName,
      lastName: registerDTO.lastName,
      role: 'user',
      isActive: registerDTO.isActive
    });

    const registration = await Registration.create({
      reg_id: registerDTO.reg_id,
      user_id: user.id,
      v_owner_name: registerDTO.v_owner_name,
      v_org_name: registerDTO.v_org_name,
      v_org_id: registerDTO.v_org_id,
      v_owner_contact: registerDTO.v_owner_contact,
      v_owner_address: registerDTO.v_owner_address,
      is_org: registerDTO.is_org,
      status: registerDTO.status
    });

    const accessToken = JWTConfig.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const refreshToken = JWTConfig.generateRefreshToken({
      userId: user.id
    });

    user.refreshToken = refreshToken;
    await user.save();
    await registration.reload();

    return new AuthResponseDTO(user, accessToken, refreshToken);
  }

  static async refreshToken(token) {
    if (!token) {
      throw new Error('Refresh token required');
    }

    const decoded = JWTConfig.verifyRefreshToken(token);

    const user = await User.findOne({
      where: {
        id: decoded.userId,
        refreshToken: token,
        isActive: true
      }
    });

    if (!user) {
      throw new Error('Invalid refresh token');
    }

    const accessToken = JWTConfig.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const newRefreshToken = JWTConfig.generateRefreshToken({
      userId: user.id
    });

    user.refreshToken = newRefreshToken;
    await user.save();

    return new AuthResponseDTO(user, accessToken, newRefreshToken);
  }

  static async logout(userId) {
    await User.update(
      { refreshToken: null },
      { where: { id: userId } }
    );
  }

  static async registerDriver(registerData) {
    console.log('Registering new driver with data:', registerData);
    const registerDTO = new DriverRequestDTO(registerData);
   
    const validation = registerDTO.validate();
     
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    


    const existingDriver = await Driver.findOne({
      where: { license_no: registerDTO.license_no }
    });

    if (existingDriver) {
      throw new Error('Driver already exists with this license number');
    }


    const newDriver = await Driver.create({
      license_no: registerDTO.license_no,
      d_name: registerDTO.d_name,
      v_owner_name: registerDTO.v_owner_name,
      v_org_name: registerDTO.v_org_name,
      v_org_id: registerDTO.v_org_id,
      d_status: registerDTO.d_status,
      reg_id: registerDTO.reg_id
    });

    await DriverStatus.create({
      d_id: newDriver.d_id,
      reg_id: registerDTO.reg_id,
      Status: registerDTO.status,
      phone_no: registerDTO.Phone_no
    });

    return {
      message: 'Driver registered successfully',
      driver: newDriver
    };
  }

  static async registerVehicle(registerData) {
    const vehicleDTO = new VehicleDto(registerData);
    const validation = vehicleDTO.validate();

    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    return vehicleDTO;
  }
//======================driver status==================================
  static async driverstatus(registerData, user) {
    const registerDTO = new DriverStatusRequestDTO(registerData);
    const validation = registerDTO.validate();

    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const { reg_id, d_id, Phone_no, Status } = registerDTO;

    const errors = [];

    if (!reg_id) errors.push('Registration ID (reg_id) is required');
    if (!d_id) errors.push('Driver ID (d_id) is required');
    if (!Phone_no || !/^[6-9]\d{9}$/.test(Phone_no)) {
      errors.push('Valid Phone number is required');
    }

    const allowedStatuses = ['Active', 'Inactive'];
    if (!allowedStatuses.includes(Status)) {
      errors.push(`Status must be one of: ${allowedStatuses.join(', ')}`);
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    const createdStatus = await DriverStatus.create({
      reg_id,
      d_id,
      Phone_no,
      Status
    });

    console.log('Driver status registered by user:', user?.id);
    return createdStatus;
  }

  static async vehiclestatus(data) {
    const dto = new VehicleStatusRequestDTO(data);
    const validation = dto.validate();

    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const { v_id, reg_id, start_date, end_date, status } = dto;

    try {
      const createdStatus = await VehicleStatus.create({
        v_id,
        reg_id,
        start_date,
        end_date,
        status
      });

      return new VehicleStatusResponseDTO(createdStatus);
    } catch (err) {
      console.error('Error in VehicleStatusService.registerVehicleStatus:', err);
      throw new Error('Failed to create vehicle status record');
    }
  }

  static async getAllStatuses() {
    try {
      const allStatuses = await VehicleStatus.findAll();
      return allStatuses.map((status) => new VehicleStatusResponseDTO(status));
    } catch (err) {
      console.error('Error in VehicleStatusService.getAllStatuses:', err);
      throw new Error('Failed to fetch vehicle status records');
    }
  }

  static async getByMobilenumber(mobileNumber) {
    console.log("Fetching driver by mobile number:", mobileNumber);

    if (!mobileNumber) {
      throw new Error("Mobile number is required");
    }

    const driver = await DriverStatus.findOne({
      where: { phone_no: mobileNumber },
      include: [
        {
          model: Driver,
          as: 'driver',
          required: false
        }
      ]
    });

    if (!driver) {
      throw new Error("No driver found with this mobile number");
    }

    return driver;
  }
  //==================================tripname================================
 static async tripname({ from, to }) {
  try {
    const newRoute = await Route.create({ from, to }); // trip_id is auto-generated here
    return RouteResponseDTO.format(newRoute); // optional DTO formatting
  } catch (error) {
    console.error("Error creating route:", error);
    throw new Error('Error creating new trip: ' + error.message);
  }
}



//================================getByregId===========================
  static async getByregId(regId) {
    try {
      const vehicles = await Vehicle.findAll({
        include: [
          {
            model: VehicleStatus,
            as: 'vehicleStatuses',
            where: { reg_id: regId }
          }
        ]
      });

      return vehicles;
    } catch (error) {
      console.error("Service Error - getByregId:", error);
      throw error;
    }
  }
}

module.exports = AuthService;
