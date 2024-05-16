import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { JWT_SECRET, JWT_EXPIRATION } from "../config/env";
import { handleError } from "../utils/handleError";

class AuthService {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const user = await User.findOne({ emailAddress: email });

      if (!user) {
        return null;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET as string, {
        expiresIn: JWT_EXPIRATION,
      });
      return { user, token };
    } catch (err: any) {
      return handleError(err);
    }
  }
}

export default new AuthService();
