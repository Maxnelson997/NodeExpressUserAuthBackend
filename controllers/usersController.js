import User from '../models/UserModel.js';
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import 'dotenv/config.js'

// Creating JWT
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '10d' })
}

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json({ success: 'users fetched', users })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Register user
const registerUser = async (req, res) => {
    // Grab email and password data from request body
    const { email, password } = req.body;

    // Check the field values
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required." })
    }

    // Check if email exists
    const exists = await User.findOne({ email: email })
    if (exists) {
        return res.status(500).json({ error: "Email already in use." })
    }

    // Hash the password
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    try {
        // Create user
        const user = await User.create({ email, password: hashedPassword })
        // Create JWT - Json Web Token
        const token = createToken(user._id)
        // Send the token to FE
        res.status(200).json({ email, token })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// login user
const loginUser = async (req, res) => {
    // Grab email and password data from request body
    const { email, password } = req.body;

    // Check the field values
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required." })
    }

    // Find user in DB
    const user = await User.findOne({ email: email })
    if (!user) {
        return res.status(500).json({ error: "incorrect email or password." })
    }

    // Check password
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        return res.status(500).json({ error: "incorrect email or password." })
    }

    try {
        // Create JWT - Json Web Token
        const token = createToken(user._id)
        // Send token to FE
        res.status(200).json({ email, token })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

export { getUsers, registerUser, loginUser }

