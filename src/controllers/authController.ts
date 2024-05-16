import { Request, Response } from "express";
import authService from "../services/authService";
import { sendResponse, HttpStatus } from "../utils/response";

class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await authService.login(email, password);

      if(!user){
        sendResponse(res, {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Invalid username or password",
        });
        return;
      }

      sendResponse(res, {
        statusCode: HttpStatus.OK,
        data: user,
      });
    } catch (err: any) {
      sendResponse(res, {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: err.message,
      });
    }
  }
}

export default new AuthController();
