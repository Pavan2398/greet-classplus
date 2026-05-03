import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateTokens from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      const { accessToken } = generateTokens(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        isPremium: user.isPremium,
        accessToken,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { accessToken } = generateTokens(res, user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        isPremium: user.isPremium,
        accessToken,
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login as Guest
// @route   POST /api/auth/guest
// @access  Public
export const loginGuest = async (req, res, next) => {
  try {
    const guestId = `guest_${Date.now()}`;
    const user = await User.create({
      name: 'Guest User',
      email: `${guestId}@guest.local`,
      isGuest: true,
    });

    const { accessToken } = generateTokens(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      isPremium: user.isPremium,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user with Google
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = sub;
        if (!user.profileImage || user.profileImage.includes('pixabay')) {
          user.profileImage = picture;
        }
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        googleId: sub,
        profileImage: picture,
      });
    }

    const { accessToken } = generateTokens(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      isPremium: user.isPremium,
      accessToken,
    });
  } catch (error) {
    res.status(401);
    next(new Error('Google authentication failed'));
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req, res, next) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Refresh access token
// @route   GET /api/auth/refresh
// @access  Public
export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
      res.status(401);
      throw new Error('Not authorized, no refresh token');
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(401);
    next(new Error('Not authorized, token failed'));
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        isPremium: user.isPremium,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};
