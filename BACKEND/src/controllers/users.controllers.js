const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email address is already registered" });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username is already taken" });
      }
    }

    const newUser = new User({
      username,
      email,
      password, 
      avatar: req.file ? req.file.path : "",
    });

    const createdUser = await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: createdUser,
    });
  } catch (error) {
    console.error("--- DETALLE DEL ERROR DE REGISTRO ---", error);

   
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      if (field === "email") {
        return res.status(400).json({ message: "Email address is already registered" });
      }
      if (field === "username") {
        return res.status(400).json({ message: "Username is already taken" });
      }
    }

    
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const userLogin = await User.findById(user._id).select("-password");
    res.json({ token, user: userLogin });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error logging in", error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

const updateName = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    req.user.username = username;
    await req.user.save();
    return res.json({
      message: "Username updated successfully",
      user: req.user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating username", error: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new passwords are required" });
    }
    const isMatch = await bcrypt.compareSync(
      currentPassword,
      req.user.password,
    );
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    req.user.password = newPassword;
    await req.user.save();
    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
};

const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }
    req.user.avatar = req.file.path;
    await req.user.save();
    return res.json({ message: "Avatar updated successfully", user: req.user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating avatar", error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateName,
  updatePassword,
  updateAvatar,
};
