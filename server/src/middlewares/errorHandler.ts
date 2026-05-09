import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server errror!";

  if (err.code === "P2002") {
    statusCode = 409;
    message = "The data already exists!";
  }

  if (err.code === "P2025") {
    statusCode = 404;
    message = "The data does not exist!";
  }

   if (err.code === "auth/id-token-expired") {
    statusCode = 401;
    message = "Your token has expired, please log in again!";
  }

  if (err.code === "auth/argument-error") {
    statusCode = 401;
    message = "Invalid token!";
  }

  res.status(statusCode).json({success: false, message, ...(process.env.NODE_ENV === "development" && {stack: err.stack})})
};
