import mongoose from "mongoose";

const userschema = new mongoose.Schema({
  employeeID: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
});

const user = mongoose.model("users", userschema);
export default user;
