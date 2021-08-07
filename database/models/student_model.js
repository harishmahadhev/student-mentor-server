import mongoose from 'mongoose';
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    mentor: { mentorId: { type: String }, name: { type: String } },
    status: { type: String },
})
const mentorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    students: [{ studentId: { type: String }, name: { type: String } }]
})

export const studentData = mongoose.model("student", studentSchema);
export const mentorData = mongoose.model("mentor", mentorSchema);