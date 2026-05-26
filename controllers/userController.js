import User from "../models/user.js"; 

export async function createUser(req , res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user != null) {
            res.json({ message: "User already exists with this email..." });
            return;
        }
        const newUser = new User({
            email: req.body.email,
            password: req.body.password,
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