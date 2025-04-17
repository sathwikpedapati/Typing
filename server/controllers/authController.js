const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createError = require('../utils/appError');

// ========== SIGNUP ==========
exports.signup = async (req, res, next) => {
  try {
    console.log('JWT_SECRET from env:', process.env.JWT_SECRET); // Debug log
    console.log('Request Body:', req.body);

    const { name, email, password, confirmPassword } = req.body;
    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();
    const trimmedConfirmPassword = confirmPassword?.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      return next(new createError("All fields are required", 400));
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      return next(new createError("Passwords do not match", 400));
    }

    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return next(new createError("Email already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(trimmedPassword, 12);

    const newUser = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
    });

    if (!process.env.JWT_SECRET) {
      return next(new createError("JWT secret key is not configured", 500));
    }

    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role || 'user',
      },
    });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.email) {
      return next(new createError("Email already exists", 400));
    }
    next(err);
  }
};

// ========== LOGIN ==========
exports.login = async (req, res, next) => {
  try {
    console.log('JWT_SECRET from env:', process.env.JWT_SECRET); // Debug log
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const isValidPassword = user && await bcrypt.compare(password, user.password);

    if (!user || !isValidPassword) {
      return next(new createError("Invalid email or password", 401));
    }

    if (!process.env.JWT_SECRET) {
      return next(new createError("JWT secret key is not configured", 500));
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });

    res.status(200).json({
      status: "success",
      message: "Logged in successfully",
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role || 'user',
      },
    });
  } catch (err) {
    next(err);
  }
};