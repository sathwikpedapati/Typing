const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwtoken = require('jsonwebtoken');
const createError = require('../utils/appError'); 

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new createError("All fields are required", 400));
    }

    const user = await User.findOne({ email });
    if (user) {
      return next(new createError("User already exists", 400));
    }

    const hashpassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password: hashpassword,
    });

    const token = jwtoken.sign({ _id: newUser._id }, "secretkey123", {
      expiresIn: "90d",
    });

    // Return both token and user data
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role, // If you have a role, return it
      },
    });

  } catch (err) {
    console.error("Signup error:", err);

    if (err.code === 11000 && err.keyPattern?.email) {
      return next(new createError("Email already exists", 400));
    }

    next(err); 
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const isValidPassword = user && await bcrypt.compare(password, user.password);

    if (!user || !isValidPassword) {
      return next(new createError("Invalid email or password", 401));
    }

    const token = jwtoken.sign({ _id: user._id }, "secretkey123", {
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
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};
