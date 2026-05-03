import User from '../models/User.js';
import path from 'path';
import fs from 'fs';

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile (name + image URL)
// @route   PUT /api/user/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.name = req.body.name || user.name;

    if (req.file) {
      // If a file was uploaded via multer, use that path
      user.profileImage = `/uploads/${req.file.filename}`;
    } else if (req.body.profileImage) {
      user.profileImage = req.body.profileImage;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImage: updatedUser.profileImage,
      isPremium: updatedUser.isPremium,
    });
  } catch (error) {
    console.error('PROFILE UPDATE ERROR:', error.stack);
    next(error);
  }
};
