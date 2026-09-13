import mongoose, { Model, Document } from "mongoose";

interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  bio: string;
  profilePic: string;
  profilePicId: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    fullname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    bio: { type: String },
    profilePic: { type: String, default: "" },
    profilePicId: { type: String, default: "" },
  },
  { timestamps: true },
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
