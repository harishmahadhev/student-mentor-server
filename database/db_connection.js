import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const url = process.env.MONGOURL;

mongoose.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) console.log("ERROR: ", JSON.stringify(err, undefined, 2));
  }
);
const mongodb = mongoose.connection;
mongodb.on("open", () => console.log("Mongodb connected"));
