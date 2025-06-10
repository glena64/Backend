
const db = require('../models'); // make sure index.js in /models returns db with initialized models
const User = db.User;
const Registration = db.Registration;
const JWTConfig = require('../config/jwt');
const LoginRequestDTO = require('../dto/request/LoginRequestDTO');
const RegisterRequestDTO = require('../dto/request/RegisterRequestDTO');
const AuthResponseDTO = require('../dto/response/AuthResponseDTO');
const RegistrationDto = require('../dto/request/RegistrationDto');
const VehicleDto = require('../dto/request/VehicleRequestDTO');
const DriverRequestDTO = require('../dto/request/DriverRequestDTO');
const DriverStatusRequestDTO = require('../dto/request/DriverStatusRequestDTO');
const VehicleStatusRequestDTO = require('../dto/request/VehicleStatusRequestDTO');
const VehicleStatusResponseDTO = require('../dto/response/VehicleStatusResponseDTO');
class AuthService {
  static async login(loginData) {
    const loginDTO = new LoginRequestDTO(loginData);
    const validation = loginDTO.validate();
    
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const user = await User.findOne({
      where: { email: loginDTO.email, isActive: true }
    });

    if (!user || !(await user.validatePassword(loginDTO.password))) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    user.lastLoginAt = new Date();
    
    // Generate tokens
    const accessToken = JWTConfig.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });
    
    const refreshToken = JWTConfig.generateRefreshToken({
      userId: user.id
    });

    // Store refresh token
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

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: registerDTO.email }
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create user
    const user = await User.create({
      email: registerDTO.email,
      password: registerDTO.password,
      firstName: registerDTO.firstName,
      lastName: registerDTO.lastName
    });
  
    // Generate tokens
    const accessToken = JWTConfig.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });
    
    const refreshToken = JWTConfig.generateRefreshToken({
      userId: user.id
    });

    // Store refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return new AuthResponseDTO(user, accessToken, refreshToken);
  }

  // REGISTER NEW 
  static async registerNew(registerData) {
    const registerDTO = new RegistrationDto(registerData);
    const validation = registerDTO.validate();
    
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: registerDTO.email }
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create user
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

    // Generate tokens
    const accessToken = JWTConfig.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });
    
    const refreshToken = JWTConfig.generateRefreshToken({
      userId: user.id
    });

    // Store refresh token
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

    // Generate new tokens
    const accessToken = JWTConfig.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });
    
    const newRefreshToken = JWTConfig.generateRefreshToken({
      userId: user.id
    });

    // Update refresh token
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

  // =============driver_tbl new registration========================
 static async registerDriver(registerData) {
    const registerDTO = new DriverRequestDTO(registerData);
    // const validation = registerDTO.validate();

    // if (!validation.isValid) {
    //   throw new Error(validation.errors.join(', '));
    // }
    // // Check if user already exists
    // const existingUser = await User.findOne({
    //   where: { email: registerDTO.email }
    // });

    // if (existingUser) {
    //   throw new Error('User already exists with this email');
    // }

    // Additional logic for driver registration can be implemented here
    return registerDTO;
  }
  static async registerVehicle(registerData) {
 
  const vehicleDTO = new VehicleDto(registerData);
  const validation = vehicleDTO.validate();

  if (!validation.isValid) {
    throw new Error(validation.errors.join(', '));
  }

  // You can now save the vehicle info into DB here
  return vehicleDTO;
}
static async driverstatus(registerData, user) {
  const registerDTO = new DriverStatusRequestDTO(registerData);
  const validation = registerDTO.validate();

  if (!validation.isValid) {
    throw new Error(validation.errors.join(', '));
  }

  // Extract fields
  const { reg_id, d_id, Phone_no, Status } = registerDTO;

  const errors = [];

  // Field validation
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

  // Create entry in driver_status_tbl
  const DriverStatus = db.DriverStatus; // Assuming model is named like this

  const createdStatus = await DriverStatus.create({
    reg_id,
    d_id,
    Phone_no,
    Status
  });

  // Optional: associate with user
  console.log('Driver status registered by user:', user?.id);

  // Return DTO or raw object
  return createdStatus; // Or wrap with response DTO if needed
}


  static async vehiclestatus(data) {
    const dto = new VehicleStatusRequestDTO(data);
    const validation = dto.validate();

    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const { v_id, reg_id, start_date, end_date, status } = dto;

    try {
      const VehicleStatus = db.VehicleStatus;

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
      const VehicleStatus = db.VehicleStatus;
      const allStatuses = await VehicleStatus.findAll();
      return allStatuses.map((status) => new VehicleStatusResponseDTO(status));
    } catch (err) {
      console.error('Error in VehicleStatusService.getAllStatuses:', err);
      throw new Error('Failed to fetch vehicle status records');
    }
  }
}

module.exports = AuthService;