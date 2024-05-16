import { Response } from "express";

interface ApiResponse {
  statusCode: number;
  message?: string;
  data?: any;
  details?: any;
}

export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const defaultMessage: { [key: number]: string } = {
  [HttpStatus.OK]: "Success",
  [HttpStatus.CREATED]: "Resource created",
  [HttpStatus.BAD_REQUEST]: "Bad Request",
  [HttpStatus.UNAUTHORIZED]: "Unauthorized",
  [HttpStatus.FORBIDDEN]: "Forbidden",
  [HttpStatus.NOT_FOUND]: "Not Found",
  [HttpStatus.INTERNAL_SERVER_ERROR]: "Internal Server Error",
};

export function sendResponse(res: Response, response: ApiResponse): void {
  const message =
    response.message || defaultMessage[response.statusCode] || "Unknown Error";

  res.status(response.statusCode).json({
    statusCode: response.statusCode,
    message,
    data: response.data || undefined,
    details: response.details || undefined,
  });
}
