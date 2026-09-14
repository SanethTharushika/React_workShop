import User from "../models/user.js"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();


export async function createUser(req , res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user != null) {
            res.json({ message: "User already exists with this email..." });
            return;
        }

        const passwordHash = bcrypt.hashSync(req.body.password, 3);
        console.log(passwordHash);

        const newUser = new User({
            email: req.body.email,
            password: passwordHash,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });
        await newUser.save();
        res.json({ message: "User created successfully..."
        });


    }catch (error) {
        res.json({ message: error.message });
    }
}

export async function loginUser(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (email == null || password == null) {
            // res.json({ message: "Email and password are required..." });
            res.status(400).json({ message: "Email and password are required..." });
            return;
        }

        const user = await User.findOne({ email: email });  
        if (user == null) {
            // res.json({ message: "No user found with this email..." });
            res.status(404).json({ message: "No user found with this email..." });
            return;
        }

        const isPasswordvalid = bcrypt.compareSync(password, user.password);
        if (isPasswordvalid) {
            // res.json({ message: "Login successful!" });
            // res.status(200).json({ message: "Login successful!" });
                const token = jwt.sign({ 
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isAdmin: user.isAdmin,
                    isBlocked: user.isBlocked,
                    isEmailVerified: user.isEmailVerified,
                    image: user.image,
                 }, 
                 process.env.JWT_SECRET_KEY,
                 {
                    expiresIn : "24h"

                 }
                );

            res.json({ message: "Login successful!", token: token , isAdmin: user.isAdmin })
            
        } else {
            // res.json({ message: "Invalid password..." });
            res.status(401).json({ message: "Invalid password..." });
            return;
        }


    }catch (error) {
        res.json({ message: error.message });
    }
}

export async function getUser(req, res) {

    if(req.user == null) {
        res.status(401).json({ message: "Unauthorized access..." });
        return;
    }
    try {
         const user = await User.findOne({ email: req.user.email });

         if(user == null) {
            res.status(404).json({ message: "User not found..." });
            return;
         }

         if(user.isBlocked) {
            res.status(403).json({ message: "User is blocked..." });
            return;
         }

         res.json({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin,
            isBlocked: user.isBlocked,
            isEmailVerified: user.isEmailVerified,
            image: user.image
         });

    }catch (error) {
        res.json({ message: error.message });
    } 
}

export async function updatePassword(req, res) {
    if(req.user == null) {
        res.status(401).json({ message: "Unauthorized access..." });
        return;
    }

    const password = req.body.password;

    const passwordHash = bcrypt.hashSync(password, 10);

    try {

        const email = req.user.email;
        await User.updateOne({ email: email }, { password : passwordHash });
        res.json({ message: "Password updated successfully..." });

    }catch (error) {
        res.json({ message: error.message });
    }
}

export async function updateProfile(req, res) {

    if(req.user == null) {
        res.status(401).json({ message: "Unauthorized access..." });
        return;
    }

    try {

        const email = req.user.email;

        await User.updateOne({ email: email }, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            image: req.body.image
        });

        res.json({ message: "Profile updated successfully..." });

    }catch (error) {
        res.json({ message: error.message });
    }

}

export async function googleLogin(req, res) {

    const accessToken = req.body.accessToken;

    try {
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }

    })

    console.log(response.data);

    const user = await User.findOne({ email: response.data.email });

    if(user == null) {

        const randomPassword = Math.random().toString(36).slice(-8);
        const passwordHash = bcrypt.hashSync(randomPassword, 10);

        const newUser = new User({
            email: response.data.email,
            password: passwordHash,
            firstName: response.data.given_name,
            lastName: response.data.family_name,
            isEmailVerified: true,
            image: response.data.picture    
        });

        await newUser.save(); 

        const token = jwt.sign({
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            isAdmin: newUser.isAdmin,
            isBlocked: newUser.isBlocked,
            isEmailVerified: newUser.isEmailVerified,
            image: newUser.image
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: "24h"
        });

        res.json({ message: "Login successful!", token: token, isAdmin: newUser.isAdmin });
    }else {

        const token = jwt.sign({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin,
            isBlocked: user.isBlocked,
            isEmailVerified: user.isEmailVerified,
            image: user.image
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: "24h"
        });

        res.json({ message: "Login successful!", token: token, isAdmin: user.isAdmin });

    }

    } catch (error) {
        console.error(error);
    }

}