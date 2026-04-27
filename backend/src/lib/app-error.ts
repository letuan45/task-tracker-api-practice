export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const badRequest = (message: string, code = "BAD_REQUEST") =>
  new AppError(400, code, message);

export const notFound = (message: string, code = "NOT_FOUND") =>
  new AppError(404, code, message);

export const conflict = (message: string, code = "CONFLICT") =>
  new AppError(409, code, message);
