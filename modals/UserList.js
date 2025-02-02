import mongoose from "mongoose";


const userListSchema = new mongoose.Schema({
email: { type: String,  trim: true },
firstName: { type: String,trim: true},
lastName: { type: String, trim: true },
password: { type: String,  trim: true },
role: { type: String, trim: true }
});

const UserListModala = mongoose.model("userlist", userListSchema);

export default UserListModala;