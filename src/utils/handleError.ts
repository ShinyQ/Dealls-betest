import mongoose from "mongoose";
import createError from "http-errors";

export const handleError = (err: any) => {
  if (err instanceof mongoose.Error.CastError && err.path === "_id") {
    throw createError(400, "Invalid user ID");
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const value = err.keyValue[field];
    throw createError(400, `User with ${field}: ${value} already exists`);
  }

  if (err) {
    const errorDetails: { field: string; message: string }[] = Object.keys(
      err.errors
    ).map((key) => ({
      field: key,
      message:
        err.code === 11000
          ? `User with this ${key} already exists`
          : err.errors[key].message,
    }));

    if (errorDetails.length > 0) {
      throw createError(400, "Validation error", { details: errorDetails });
    }
  }

  throw createError(500, "Error processing request");
};
