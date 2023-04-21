const router = require("express").Router();
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


//Register a user
router.post("/register", async (req, res, next) => {
    try {
        let checkExists;
        let email = req.body.email;
        let password = req.body.password;

        checkExists = await User.findOne({ email });


        if (checkExists) {
            return res.status(500).json({ msg: "Account Already Exists" });
        }


        let hashedPassword = await bcrypt.hash(password, 10);


        let newUser = await User.create({
            email: email,
            password: hashedPassword
        });


        await newUser.save();

        delete user.password;

        return res.json(newUser);



    } catch (err) {
        console.log(err);
    }



});

//Login a userwhere
router.post("/login", async (req, res, next) => {

    try {

        const { email, password } = req.body;

    

        let existingUser = await User.login(email, password);


        

        let id = existingUser._id;

        //create token
        const token = jwt.sign({ id }, 'secret123', { expiresIn: '3d' });

        res.status(200).json({ email, token });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }


});




module.exports = router;

