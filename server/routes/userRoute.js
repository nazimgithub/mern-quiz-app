const router = require('express').Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middlewares/authMiddleware');

// user registration
router.post("/register", async (req, res) => {
    try {
        // check if user already exists
        const userExists = await User.findOne({ user_email: req.body.user_email });
        if (userExists) {
            return res
                .status(200)
                .send({ message: "User already exists", success: false });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(req.body.user_password, salt);
        req.body.user_password = hasedPassword;

        // create new user
        const newUser = new User(req.body);
        await newUser.save();
        res.send({
            message: "User created successfully!.",
            success: true
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        });
    }
});

// user login
router.post("/login", async (req, res) => {
    try {
        // check user exists or not
        const user = await User.findOne({ user_email: req.body.email });
        if (!user) {
            return res
                .status(200)
                .send({ message: "user does not exist!", success: false });;
        }

        // check password
        const validatePassword = await bcrypt.compare(
            req.body.password,
            user.user_password
        );

        if (!validatePassword) {
            return res
                .status(200)
                .send({ message: "Invalid Password", success: false })
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SCERET,
            { expiresIn: "1d" }
        );

        res.send({
            message: "user logged in successfully!",
            success: true,
            data: token
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        });
    }
});

// get user info

router.post("/get-user-info", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        res.send({
            message: "User info fetched successfully!",
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        });
    }
});

module.exports = router;