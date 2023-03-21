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
        let foundUser;
        const { email, password } = req.body;

        foundUser = await User.findOne({ email });

        if (!foundUser) {
            return res.status(401).json({ msg: "Account Does not Exist" });
        }

        const isPasswordValid = await bcrypt.compare(password, foundUser.password);

        if (!isPasswordValid) {

            return res.status(401).json({ msg: "Email or password is incorrect" });

        }



        delete foundUser.password;

        const accessToken = jwt.sign({
            id: foundUser._id,
            isAdmin: foundUser.isAdmin
        }, process.env.JWT_SEC,
            { expiresIn: "3d" }
        );


        return res.status(200).json({ foundUser, accessToken });






    } catch (err) {
        console.log(err);
    }


});




module.exports = router;

