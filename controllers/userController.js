import User from "../models/user.js"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
                    image: user.image
                 }, 
                 "secretkey2003!!!!"
                );

            res.json({ message: "Login successful!", token: token})
           
            
        } else {
            // res.json({ message: "Invalid password..." });
            res.status(401).json({ message: "Invalid password..." });
            return;
        }


    }catch (error) {
        res.json({ message: error.message });
    }
}