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

    if(req.user == null) {
        res.status(401).json({ message: "Unauthorized access..." });
        return;
    }

    if(req.user.isAdmin == false) {
        res.status(403).json({ message: "Only administrators can create students..." });
        return;
    }

    const newStudent = new Student(req.body);
    newStudent.save().then(
        () => {
            res.json("Student added successfully...");
        }
    )
}
 