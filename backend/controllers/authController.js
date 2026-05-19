import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, mobile, state, district, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      mobile,
      state,
      district,
      role
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || '',
        aadhar: user.aadhar || '',
        address: user.address || '',
        pinCode: user.pinCode || '',
        farmId: user.farmId || '',
        farmSize: user.farmSize || '',
        currentCrop: user.currentCrop || '',
        farmLocation: user.farmLocation || '',
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || '',
        aadhar: user.aadhar || '',
        address: user.address || '',
        pinCode: user.pinCode || '',
        farmId: user.farmId || '',
        farmSize: user.farmSize || '',
        currentCrop: user.currentCrop || '',
        farmLocation: user.farmLocation || '',
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile details & picture
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.mobile = req.body.mobile || user.mobile;
      user.state = req.body.state || user.state;
      user.district = req.body.district || user.district;
      if (req.body.profileImage !== undefined) {
        user.profileImage = req.body.profileImage;
      }
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      // Update new fields
      if (req.body.aadhar !== undefined) user.aadhar = req.body.aadhar;
      if (req.body.address !== undefined) user.address = req.body.address;
      if (req.body.pinCode !== undefined) user.pinCode = req.body.pinCode;
      if (req.body.farmId !== undefined) user.farmId = req.body.farmId;
      if (req.body.farmSize !== undefined) user.farmSize = req.body.farmSize;
      if (req.body.currentCrop !== undefined) user.currentCrop = req.body.currentCrop;
      if (req.body.farmLocation !== undefined) user.farmLocation = req.body.farmLocation;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage || '',
        aadhar: updatedUser.aadhar || '',
        address: updatedUser.address || '',
        pinCode: updatedUser.pinCode || '',
        farmId: updatedUser.farmId || '',
        farmSize: updatedUser.farmSize || '',
        currentCrop: updatedUser.currentCrop || '',
        farmLocation: updatedUser.farmLocation || '',
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
