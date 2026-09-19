const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken")
router.post("/register", async(req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
    return res.status(400).json({
        message: "All fields are required"
    });
}
    const existingUser = await User.findOne({ email });
    if(existingUser){
        return res.status(400).json({
            message: "Email Already Exists"
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        name,
        email,
        password: hashedPassword
    });
    await user.save();

    res.status(201).json({
        message: "User registered successfully"
    });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
    return res.status(400).json({
        message: "Email and password are required"
    });
}
    const user = await User.findOne({ email });
    if(!user){
        return res.status(400).json({
            message: "Invalid Email or Password"
        });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.stautus(400).json({
            message: "Invalid Entries"
        });
    }
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET
    );
    res.status(200).json({
        message: "Login Successfull",
        token: token
    });
});

module.exports = router;
