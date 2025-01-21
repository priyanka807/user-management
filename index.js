import express from "express";
import connectDB from "./db/connectdb.js";
import cors from "cors";
import userRouter from "./routers/userRouter.js";

const app = express();
app.use(cors());
const port = process.env.PORT || "8001"; //api port

const DATABASE_URL = 'mongodb+srv://priyankacoder11:never458032@cluster0.7lzfz.mongodb.net/'; //database port

//db connection
connectDB(DATABASE_URL);
app.use(express.json());

//routers
app.use("/api", userRouter);

//welcome to home page
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Backend Server!</h1>');
});
//app listen port
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
