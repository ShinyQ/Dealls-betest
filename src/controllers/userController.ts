import { Request, Response } from "express";
import userService from "../services/userService";
import { sendResponse, HttpStatus } from "../utils/response";

class UserController {
  async getUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getUsers();
      sendResponse(res, { statusCode: HttpStatus.OK, data: users });
    } catch (err: any) {
      sendResponse(res, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      await userService.createUser(req.body);
      sendResponse(res, {
        statusCode: HttpStatus.CREATED,
        message: "User created",
      });
    } catch (err: any) {
      sendResponse(res, {
        statusCode: err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
        details: err.details,
      });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      await userService.updateUser(req.params.id, req.body);
      sendResponse(res, { statusCode: HttpStatus.OK });
    } catch (err: any) {
      sendResponse(res, {
        statusCode: err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.deleteUser(req.params.id);

      if (!user) {
        sendResponse(res, {
          statusCode: HttpStatus.NOT_FOUND,
          message: "User not found",
        });
        return;
      }

      sendResponse(res, { statusCode: HttpStatus.OK, message: "User removed" });
    } catch (err: any) {
      sendResponse(res, {
        statusCode: err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }
}

export default new UserController();
