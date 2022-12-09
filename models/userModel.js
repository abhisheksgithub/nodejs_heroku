import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: 10
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm Password is required"],
    validate: {
      validator: function (el) {
        // this -- document
        return el === this.password;
      },
      message: "The passwords are not matching.",
    },
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin", "merchant", "moderator"],
      message: "Enter the correct role!",
    },
    default: "user",
  },
  active: {
    type: Boolean,
    default: true
  },
  passwordChangedTimeStamp: Date,
});

userSchema.pre("save", async function (next) {
  // this // document
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedTimeStamp = Date.now() - 1000;
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.validatePassword = async function (
  clientPassword,
  dbPassword
) {
  return await bcrypt.compare(clientPassword, dbPassword);
};

userSchema.methods.tokenPasswordValidation = function (tokenIssueDate) {
  if (this.passwordChangedTimeStamp) {
    const passwordChanged = Math.floor(
      this.passwordChangedTimeStamp.getTime() / 1000
    );
    return tokenIssueDate > passwordChanged;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

export default User;

// DOB, Cell Number 1669559168
