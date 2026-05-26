import express from 'express';
import mongoose from 'mongoose';
import Student from "./models/student.js";
import studentRouter from "./routers/studentRouter.js";
import userRouter from "./routers/userRouter.js";
//temporary
import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);


const app = express();

const mongoDBURI = "mongodb+srv://admin:12345@cluster0.9tog6bq.mongodb.net/dev?appName=Cluster0"

mongoose.connect(mongoDBURI).then(
    () => {
        console.log("Connected to MongoDB successfully...");
    }
)

app.use(express.json());
app.use("/students", studentRouter);
app.use("/users", userRouter);

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