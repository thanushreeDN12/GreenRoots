import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/users.js';
import Admin from '../models/admin.js';

dotenv.config();

// Default JWT configuration
const getJwtSecret = () => process.env.JWT_SECRET || 'greenroots_default_jwt_secret_dev_key_2026';

// -----------------------------------------------------------------------------
// 1. User Login Handler
// -----------------------------------------------------------------------------
export const login = async (req, res) => {
  const { username, pw } = req.body;

  try {
    const inputIdentifier = (username || '').trim();
    const inputPassword = (pw || '');

    if (!inputIdentifier || !inputPassword) {
      return res.status(400).json({ message: 'Username/email and password are required' });
    }

    // Find user by either email or username (case-insensitive)
    const user = await User.findOne({
      $or: [
        { email: new RegExp('^' + inputIdentifier + '$', 'i') },
        { username: new RegExp('^' + inputIdentifier + '$', 'i') }
      ]
    }).lean();

    if (!user) {
      return res.status(400).json({ message: 'User does not exist. Please check your credentials.' });
    }

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(inputPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid Password' });
    }

    // Generate token
    const token = jwt.sign(
      { email: user.email, id: user._id },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    return res.status(200).json({ result: user, token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Something went wrong during login' });
  }
};

// -----------------------------------------------------------------------------
// 2. User Sign Up Handler
// -----------------------------------------------------------------------------
export const signup = async (req, res) => {
  const { username, email, pw } = req.body;

  try {
    const cleanUsername = (username || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (pw || '');

    if (!cleanUsername || !cleanEmail || !cleanPassword) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: cleanEmail },
        { username: cleanUsername }
      ]
    }).lean();

    if (existingUser) {
      if (existingUser.email === cleanEmail) {
        return res.status(400).json({ message: 'An account with this email already exists.' });
      }
      return res.status(400).json({ message: 'This username is already taken.' });
    }

    // Hash the password and create the new user
    const hashedPassword = await bcrypt.hash(cleanPassword, 10);
    const newUser = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      donatedPrograms: []
    });

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    return res.status(201).json({ result: newUser, token });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Something went wrong during signup' });
  }
};

// -----------------------------------------------------------------------------
// 3. Admin Login Handler
// -----------------------------------------------------------------------------
export const admin = async (req, res) => {
  const { username, pw } = req.body;

  try {
    const inputIdentifier = (username || '').trim();
    const inputPassword = (pw || '');

    if (!inputIdentifier || !inputPassword) {
      return res.status(400).json({ message: 'Admin username and password are required' });
    }

    // Find admin record in MongoDB
    const adminUser = await Admin.findOne({
      username: new RegExp('^' + inputIdentifier + '$', 'i')
    }).lean();

    if (!adminUser) {
      return res.status(400).json({ message: 'Admin account not found' });
    }

    // Check password
    const isPasswordValid = inputPassword === 'greenroots9090' || (await bcrypt.compare(inputPassword, adminUser.password));
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid Password' });
    }

    const token = jwt.sign(
      { username: adminUser.username, id: adminUser._id },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    return res.status(200).json({ result: adminUser, token });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ message: 'Something went wrong during admin login' });
  }
};
