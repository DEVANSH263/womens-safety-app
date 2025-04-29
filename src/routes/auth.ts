import express from 'express';
import { User } from '../../models/User';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Login route
// @ts-ignore: Express typings issue
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists in database
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ message: 'Database connection error' });
    }
    
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: '1d' }
    );

    // Return token and user info (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register route
// @ts-ignore: Express typings issue
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phoneNumber } = req.body;

    // Validate input
    if (!email || !password || !name || !phoneNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ message: 'Database connection error' });
    }
    
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser: User = {
      email,
      name,
      phoneNumber,
      password: hashedPassword,
      emergencyContacts: [],
      safeZones: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save to database
    const result = await usersCollection.insertOne(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.insertedId, email },
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: '1d' }
    );

    // Return success with token and user info (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user info
// @ts-ignore: Express typings issue
router.get('/me', async (req, res) => {
  try {
    // Get token from request header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key') as { userId: string };
    
    // Get user from database
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ message: 'Database connection error' });
    }
    
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ _id: new mongoose.Types.ObjectId(decoded.userId) });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user info without password
    const { password, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    console.error('Auth verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 