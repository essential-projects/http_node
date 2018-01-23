import {BaseError as EssentialProjectsError, ErrorCodes} from '@essential-projects/errors.ts';
import {NextFunction, Request, Response} from 'express';
import {Logger} from 'loggerhythm';

const logger: Logger = Logger.createLogger('http_node').createChildLogger('error_handler');

function errorIsEssentialProjectsError(error: any): error is EssentialProjectsError {
  return error.isEssentialProjectsError === true;
}

export function errorHandler(error: Error | EssentialProjectsError, request: Request, response: Response, next: NextFunction): void {
  let statusCode: number = ErrorCodes.InternalServerError;
  let responseMessage: string = '';

  if (error instanceof Error) {
    responseMessage = error.message;
  } else {
    logger.warn('non-error thrown:', error);
  }

  if (errorIsEssentialProjectsError(error)) {
    statusCode = error.code;
  }

  response.status(statusCode).send(error.message);
}
