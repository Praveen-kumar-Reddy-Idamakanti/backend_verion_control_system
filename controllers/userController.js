const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const { User } = require("../models/userModel");
const ObjectId = mongoose.Types.ObjectId;

async function getAllUsers(req, res) {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (e) {
    console.error("Error occurred while fetching users", e);
    res.status(500).json({ message: "Error occurred while fetching users", error: e.message });
  }
};  

async function getUserById(req, res) {
  const curr_id = req.params.id;
  try {
    if (!ObjectId.isValid(curr_id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    const user = await User.findById(curr_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (e) {
    console.error("Error occurred while fetching user", e);
    res.status(500).json({ message: "Error occurred while fetching user", error: e.message });
  }
};

async function signup(req, res) {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email and password are required" });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      repositories: [],
      followedUsers: [],
      starDir: [],
    });

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
    res.status(201).json({ message: "User created successfully", userId: user._id, token });
  } catch (error) {
    console.error("Error occurred while storing in DB", error);
    res.status(500).json({ message: "Error occurred while storing in DB", error: error.message });
  }
};

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Error occurred while logging in", error);
    res.status(500).json({ message: "Error occurred while logging in", error: error.message });
  }
};

async function getUserProfileById(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User profile fetched successfully", user });
  } catch (error) {
    console.error("Error occurred while getting user profile", error);
    res.status(500).json({ message: "Error occurred while getting user profile", error: error.message });
  }
};

async function updateUserProfile(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const updateFields = {};
    if (req.body.username) updateFields.username = req.body.username;
    if (req.body.email) updateFields.email = req.body.email;
    if (req.body.password) {
      updateFields.password = await bcryptjs.hash(req.body.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User profile updated successfully", user });
  } catch (error) {
    console.error("Error occurred while updating user profile", error);
    res.status(500).json({ message: "Error occurred while updating user profile", error: error.message });
  }
};

async function deleteUserProfile(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User profile deleted" });
  } catch (error) {
    console.error("Error occurred while deleting user profile", error);
    res.status(500).json({ message: "Error occurred while deleting user profile", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  signup,
  login,
  getUserProfileById,
  updateUserProfile,
  deleteUserProfile,
};