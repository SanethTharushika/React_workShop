import Student from "../models/student.js"; 

export function getAllStudents(req , res) {
    Student.find().then(
        (result) => {
            res.json(result);
        }
    )
}

export async function getAllStudentNew(req , res) {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export function createStudent(req , res) {
    const newStudent = new Student(req.body);
    newStudent.save().then(
        () => {
            res.json("Student added successfully...");
        }
    )
}
 