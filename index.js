import express, { json } from "express";
import "./database/db_connection.js";
import { mentorRouter } from "./routes/mentor_route.js";
import { studentRouter } from "./routes/student_route.js";
import cors from 'cors'
const app = express();
const PORT = process.env.PORT || 5000;
app.use(json());
app.use(cors());
app.use("/student", studentRouter)
app.use("/mentor", mentorRouter)
app.use("/", async (req, res) => {
    res.send("Server is running")
})

app.listen(PORT, () => console.log(`Server Started at ${PORT}`));
