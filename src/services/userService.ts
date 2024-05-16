import User, { IUser } from "../models/User";
import { handleError } from "../utils/handleError";
import redisClient from "../config/redis";
import { Document, Types } from "mongoose";
import authService from "./authService";

class UserService {
  async getUsers(): Promise<IUser[]> {
    try {
      return await User.find();
    } catch (err: any) {
      return handleError(err);
    }
  }

  async getUserByFilter(value: string, filterType: string) {
    try {
      let user: any = null;
      user = await this.getUserBy(filterType, value);

      return user;
    } catch (err: any) {
      return handleError(err);
    }
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    try {
      const user = new User(data);
      await user.save();
      await this.cacheUser(user);

      return user;
    } catch (err: any) {
      return handleError(err);
    }
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    try {
      if(data.password){
        data.password = await authService.hashPassword(data.password);
      }

      const user = await User.findByIdAndUpdate(id, data, { new: true });
      if (user) {
        await this.cacheUser(user);
      }

      return user;
    } catch (err: any) {
      return handleError(err);
    }
  }

  async deleteUser(id: string): Promise<IUser | null> {
    try {
      const user = await User.findByIdAndDelete(id);

      if (user) {
        await this.deleteCacheKeys(user);
      }

      return user;
    } catch (err: any) {
      return handleError(err);
    }
  }

  private async cacheUser(
    user:
      | (Document<unknown, {}, IUser> & IUser & { _id: Types.ObjectId })
      | null
  ) {
    if (user) {
      await redisClient.set(
        `accountNumber:${user.accountNumber}`,
        JSON.stringify(user)
      );
      await redisClient.set(
        `identityNumber:${user.identityNumber}`,
        JSON.stringify(user)
      );
    }
  }

  private async getUserBy(key: string, value: string): Promise<any> {
    try {
      let user = await redisClient.get(`${key}:${value}`);

      if (user) {
        user = JSON.parse(user);
      } else {
        user = await User.findOne({ [key]: value });

        if (user) {
          await redisClient.set(`${key}:${value}`, JSON.stringify(user));
        }
      }

      return user || null;
    } catch (err: any) {
      return handleError(err);
    }
  }

  private async deleteCacheKeys(
    user: (Document<unknown, {}, IUser> & IUser & { _id: Types.ObjectId })
  ) {
    await redisClient.delete(`accountNumber:${user.accountNumber}`);
    await redisClient.delete(`identityNumber:${user.identityNumber}`);
  }
}

export default new UserService();
