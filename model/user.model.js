import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    default: "customer",
  },
  password: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
    default: "Not given",
  },

  isEmailverified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const User= new mongoose.model('user',userSchema);

export default User;
