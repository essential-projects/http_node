import {BaseError as EssentialProjectsError} from '@essential-projects/errors.ts';
import {NextFunction, Request, Response} from 'express';

function errorIsEssentialProjectsError(error: any): error is EssentialProjectsError {
  return error.isEssentialProjectsError === true;
}

export function errorHandler(error: Error | EssentialProjectsError, request: Request, response: Response, next: NextFunction): void {
  let statusCode: number = 500;
  if (errorIsEssentialProjectsError(error)) {
    statusCode = error.code;
  }

  response.status(statusCode).send(error.message);
}
