import mongoose, { Document, Schema } from "mongoose";
import authService from "../services/authService";

export interface IUser extends Document {
  userName: string;
  accountNumber: string;
  emailAddress: string;
  identityNumber: string;
  password: string;
  refreshToken: string;
}

const UserSchema: Schema = new Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: [true, "User name is required"],
    },
    accountNumber: {
      type: String,
      unique: true,
      required: [true, "Account number is required"],
    },
    emailAddress: {
      type: String,
      unique: true,
      required: [true, "Email address is required"],
    },
    identityNumber: {
      type: String,
      unique: true,
      required: [true, "Identity number is required"],
    },
    password: { type: String, required: [true, "Password is required"] },
    refreshToken: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ accountNumber: 1 }, { unique: true });
UserSchema.index({ emailAddress: 1 }, { unique: true });
UserSchema.index({ identityNumber: 1 }, { unique: true });

UserSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const hashedPassword = await authService.hashPassword(this.password);
      this.password = hashedPassword;
    } catch (err: any) {
      return next(err);
    }
  }
  next();
});

export default mongoose.model<IUser>("User", UserSchema);
