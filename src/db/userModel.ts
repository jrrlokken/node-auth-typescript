import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email address"],
    unique: [true, "Email already registered"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    unique: false,
  },
});

// export default mongoose.model.Users || mongoose.model("Users", UserSchema);
export default mongoose.model("Users", UserSchema);
