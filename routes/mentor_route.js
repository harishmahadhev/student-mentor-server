import Router from 'express';
import { mentorData } from '../database/models/student_model.js';
import { studentData } from './../database/models/student_model.js';
const mentorRouter = Router();

mentorRouter
    .route("/")
    //Displaying all Mentors
    .get(async (req, res) => {
        const mentor = await mentorData.find();
        res.status(200).json(mentor)
    })

    //Creating Mentors
    .post(async (req, res) => {
        const { name, email, phone } = req.body;
        const isExist = await mentorData.findOne({ email });
        try {
            if (isExist) return res.status(406).json({ message: "Email already Exists" })
            const mentor = new mentorData({ name, email, phone })
            mentor.save();
            res.status(200).json({ message: "Mentor added Successfully" });
        } catch (error) {
            res.send(error);
        }
    })
    //Adding Students to mentor
    .patch(async (req, res) => {
        const { mentorId, studentId } = req.body;
        console.log(studentId)
        if (!mentorId || !studentId) return res.status(400).json({ message: "Field is empty" })
        try {
            studentId.forEach(async (element) => {
                const student = await studentData.findById(element);
                const mentor = await mentorData.findById(mentorId);
                if (!student || !mentor) return res.status(404).json({ message: "Not valid ID" })
                await mentorData.updateOne({ _id: mentorId }, {
                    $push: {
                        students: { studentId: element, name: student.name },
                    }
                })
                await studentData.updateOne({ _id: element }, {
                    $set: {
                        mentor: { mentorId, name: mentor.name },
                        status: "true",
                    },
                })
            })
            res.status(200).json({ message: "Students added to mentor" })

        } catch (error) {
            res.send(error)
        }
    })
mentorRouter
    .route("/getStudent")
    .get(async (req, res) => {
        const { id } = req.params;
        const mentor = await mentorData.findById(id);
        const students = [];
        mentor.students.forEach(async (element) => {
            students.push(element.name)
        })
        res.status(200).json({ students });
    })

mentorRouter
    .route("/:id")
    .get(async (req, res) => {
        const { id } = req.params;
        const mentor = await mentorData.findById(id);
        res.status(200).json({ message: mentor });
    })
    .delete(async (req, res) => {
        const { id } = req.params;
        const mentor = await mentorData.findByIdAndRemove(id);
        res.status(200).json({ mentor, message: "Student Deleted Successfully" })
    })

export { mentorRouter };