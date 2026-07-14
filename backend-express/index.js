import express from 'express';
import mongoose from 'mongoose';
import Student from "./models/student.js";
import studentRouter from "./routers/studentRouter.js";
import userRouter from "./routers/userRouter.js";
import jwt from "jsonwebtoken";
import authenticate from './middlewares/authenticate.js';
import productRouter from './routers/productRouter.js';
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();


//temporary
import dns from "node:dns";
import authentication from './middlewares/authenticate.js';
dns.setServers(["1.1.1.1", "8.8.8.8"]);


const app = express();

app.use(cors());

const mongoDBURI = process.env.MONGO_URI;

mongoose.connect(mongoDBURI).then(
    () => {
        console.log("Connected to MongoDB successfully...");
    }
)

app.use(express.json());

app.use(authentication);


app.use("/students", studentRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

app.get("/", (req, res)=>{
    Student.find().then(
        (students) => {
           res.json(students);
        }
        

        
    )
})

app.post("/", (req, res)=>{
    const newStudent = new Student(req.body);
    newStudent.save().then(
    () => {
        res.json("Student added successfully...");
    }

    )

    
})
 
app.listen(3000, (req, res) => {
    console.log("Server started successfully...");
});