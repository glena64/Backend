const AuthService = require('../services/authService');
const BaseResponseDTO = require('../dto/response/BaseResponseDTO');

class AuthController {
  static async login(req, res) {
    try {
      const result = await AuthService.login(req.body);
      res.json(BaseResponseDTO.success(result, 'Login successful'));
    } catch (error) {
      res.status(400).json(BaseResponseDTO.error(error.message));
    }
  }

  static async register(req, res) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(BaseResponseDTO.success(result, 'Registration successful'));
    } catch (error) {
      res.status(400).json(BaseResponseDTO.error(error.message));
    }
  }
  //===============Driver Status Registration================
  static async driverstatus(req, res) {
    try {
      console.log('Registering driver status with data:', req.body);
      const result = await AuthService.driverstatus(req.body);
      res.status(201).json(BaseResponseDTO.success(result, 'Driver status registration successful'));
    } catch (error) {
      res.status(400).json(BaseResponseDTO.error(error.message));
    }
  }
//===========================vehicle status registration=============
  static async vehiclestatus(req, res) {
    try {
      console.log('Registering vehicle status with data:', req.body);
      const result = await AuthService.vehiclestatus(req.body);
      res.status(201).json(BaseResponseDTO.success(result, 'Vehicle status registration successful'));
    } catch (error) {
      res.status(400).json(BaseResponseDTO.error(error.message));
    }
  }
  //===================================================================

  static async registerNew(req, res) {
    try {
      console.log('Registering new user with data:', req.body);
      const result = await AuthService.registerNew(req.body);
      res.status(201).json(BaseResponseDTO.success(result, 'Registration successful'));
    } catch (error) {
      res.status(400).json(BaseResponseDTO.error(error.message));
    }
  }

  //===================getbyLicense========================
static async getByLicense(req, res) {
 let license = req.body.License;
  console.log('getByLicense called with license:', license);
  
      if (!license) {
        return res.status(400).json(BaseResponseDTO.error("License number is required"));
      }
  
      try {
        const result = await AuthService.getByLicense(license);
  
        if (!result) {
          return res.status(404).json(BaseResponseDTO.error("User not found"));
        }
  
        return res.json(BaseResponseDTO.success(result, 'User fetched successfully'));
      } catch (error) {
        console.error("Error fetching user by license:", error);
        res.status(500).json(BaseResponseDTO.error("Server error: " + error.message));
      }
    }


  //=======================getByMobilenumber==============================
static async getByMobilenumber(req, res) {
  try {
    let mobile  = req.body.Mobilenumber;
   console.log('getByMobilenumber called with mobile:', mobile);
   
    if (!mobile) {
      return res.status(400).json(BaseResponseDTO.error("Mobile number is required"));
    }

    // console.log('Fetching user by mobile number:', mobile);

    const result = await AuthService.getByMobilenumber(mobile);

    if (!result) {
      return res.status(404).json(BaseResponseDTO.error("User not found"));
    }

    return res.json(BaseResponseDTO.success(result, 'User fetched successfully'));
  } catch (error) {
    console.error("Error fetching user by mobile number:", error);
    res.status(500).json(BaseResponseDTO.error("Server error: " + error.message));
  }
}
//==================================getByregId===========================================
static async getByregId(req, res) {
  try {
    let regId = req.body.regId;
    console.log('getByregId called with regId:', regId);
    
    if (!regId) {
      return res.status(400).json(BaseResponseDTO.error("Registration ID is required"));
    }

    const result = await AuthService.getByregId(regId);

    if (!result) {
      return res.status(404).json(BaseResponseDTO.error("User not found"));
    }

    return res.json(BaseResponseDTO.success(result, 'User fetched successfully'));
  } catch (error) {
    console.error("Error fetching user by registration ID:", error);
    res.status(500).json(BaseResponseDTO.error("Server error: " + error.message));
  }
}
//===========================tripname=======================================
static async tripname(req, res) {
  try {
    const { from, to } = req.body;

    const result = await AuthService.tripname ({ from, to });

    return res.status(201).json(BaseResponseDTO.success(result, 'Trip created successfully'));
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json(BaseResponseDTO.error("Server error: " + error.message));
  }
}
//=========================================================================================



  //driver_tbl registration
  static async registerDriver(req,res){
    try{
      // console.log('Registering new driver with data:', req.body);
      // res.status(400).json(BaseResponseDTO.error(error.message));
      const result = await AuthService.registerDriver(req.body);
      res.status(201).json(BaseResponseDTO.success(result, 'Driver registration successful'));
    }catch (error){
      res.status(400).json(BaseResponseDTO.error(error.message));
    }
  }
  //vehicle registration
  static async registerVehicle(req, res) {
    try {
      console.log('Registering new vehicle with data:', req.body);
      const result = await AuthService.registerVehicle(req.body);
      res.status(201).json(BaseResponseDTO.success(result, 'Vehicle registration successful'));
    } catch (error) {
      res.status(400).json(BaseResponseDTO.error(error.message));
    }
  }

  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);
      res.json(BaseResponseDTO.success(result, 'Token refreshed successfully'));
    } catch (error) {
      res.status(401).json(BaseResponseDTO.error(error.message));
    }
  }

  static async logout(req, res) {
    try {
      await AuthService.logout(req.user.id);
      res.json(BaseResponseDTO.success(null, 'Logout successful'));
    } catch (error) {
      res.status(400).json(BaseResponseDTO.error(error.message));
    }
  }

  static async profile(req, res) {
    try {
      const UserResponseDTO = require('../dto/response/UserResponseDTO');
      const userResponse = new UserResponseDTO(req.user);
      res.json(BaseResponseDTO.success(userResponse, 'Profile retrieved successfully'));
    } catch (error) {
      res.status(400).json(BaseResponseDTO.error(error.message));
    }
  }
}

module.exports = AuthController;