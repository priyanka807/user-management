import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: {type: String, required:true},
  name: { type: String, required: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
});

const UserModala = mongoose.model("user", userSchema);

export default UserModala;
