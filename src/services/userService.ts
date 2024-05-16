import User, { IUser } from "../models/User";
import { handleError } from "../utils/handleError";

class UserService {
  async getUsers(): Promise<IUser[]> {
    try {
      return await User.find();
    } catch (err: any) {
      return handleError(err);
    }
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    try {
      const user = new User(data);
      await user.save();

      return user;
    } catch (err: any) {
      return handleError(err);
    }
  }

  async getUserByEmailAddress(emailAddress: string): Promise<IUser | null> {
    try {
      return await User.findOne({ emailAddress });
    } catch (err: any) {
      return handleError(err);
    }
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    try {
      const user = await User.findByIdAndUpdate(id, data, { new: true });
      return user;
    } catch (err: any) {
      return handleError(err);
    }
  }

  async deleteUser(id: string): Promise<IUser | null> {
    try {
      const user = await User.findByIdAndDelete(id);
      return user;
    } catch (err: any) {
      return handleError(err);
    }
  }
}

export default new UserService();
