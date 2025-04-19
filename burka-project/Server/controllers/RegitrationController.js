const UserModel = require('../models/RegistrationModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Controller to handle user registration
const Registration = async (req, res) => {
    const {
        firmName,
        contactName,
        contactType,
        mobile1,
        mobile2,
        whatsapp,
        email,
        state,
        city,
        address,
        password,
        discount
    } = req.body;

    try {
        const user = await UserModel.create({
            firmName,
            contactName,
            contactType,
            mobile1,
            mobile2,
            whatsapp,
            email,
            state,
            city,
            address,
            password,
            discount
        });

        res.status(200).send("User successfully registered!");
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send("An error occurred during registration.");
    }
};
const Login = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        // Find the user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        // Create a JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email }, // Payload
            process.env.JWT_SECRET, // Secret key from environment variables
            { expiresIn: '1h' } // Token expiration time
        );

        // Send the token back to the client
        res.status(200).json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "An error occurred during login." });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, { password: 0 });
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "An error occurred while fetching users." });
    }
};
module.exports = {
    Registration,
    Login,
    getAllUsers
};
