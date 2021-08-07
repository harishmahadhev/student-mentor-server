import express from 'express'
import { mentorData, studentData } from '../database/models/student_model.js';
const studentRouter = express.Router();

studentRouter
    .route("/")

    .get(async (req, res) => {
        const student = await studentData.find();
        res.send(student);
    })

    .post(async (req, res) => {
        const { name, email, phone } = req.body;
        const isExist = await studentData.findOne({ email });
        try {
            if (isExist) return res.status(406).json({ message: "Email already exists" });
            const student = await studentData.create({ name, email, phone });
            student.save();
            res.status(200).json({ message: "Student created Succesfully" })
        } catch (error) {
            res.send(error)
        }
    })

    .patch(async (req, res) => {
        const { studentId, mentorId } = req.body;
        if (!req.body) return res.status(400).json({ message: "Field is empty" })
        try {
            const student = await studentData.findById(studentId);
            const mentor = await mentorData.findById(mentorId);
            if (!student || !mentor) return res.status(404).json({ message: "Not found" })
            const oldmentor = student.mentor;
            await mentorData.updateOne({ _id: oldmentor.mentorId }, { $pull: { students: { studentId: studentId } } })
            await studentData.updateOne({ _id: studentId }, {
                $set: { mentor: { mentorId: mentorId, name: mentor.name, status: "true" } }
            })
            await mentorData.updateOne({ _id: mentorId }, { $push: { students: { studentId, name: student.name } } })
            res.status(200).json({ message: "Mentor Updated successfully" })
        } catch (error) {
            res.send(error)
        }
    })
studentRouter
    .route("/:id")
    .get(async (req, res) => {
        const { id } = req.params;
        const student = await studentData.findById(id);
        res.status(200).json({ message: student })
    })
    .delete(async (req, res) => {
        const { id } = req.params;
        const student = await studentData.findByIdAndRemove(id);
        res.status(200).json({ student, message: "Student Deleted Successfully" })
    })

export { studentRouter };