import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { HttpStatus, sendResponse } from "../utils/response";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET as string, (err) => {
      if (err) {
        return res.sendStatus(403);
      }

      next();
    });
  } else {
    sendResponse(res, {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: "Access Unauthorized",
    });
  }
};
