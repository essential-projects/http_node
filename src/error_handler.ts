import {BaseError as EssentialProjectsError, ErrorCodes, isEssentialProjectsError} from '@essential-projects/errors.ts';
import {NextFunction, Request, Response} from 'express';
import {Logger} from 'loggerhythm';

const logger: Logger = Logger
                        .createLogger('http_node')
                        .createChildLogger('error_handler');

export function errorHandler(error: Error | EssentialProjectsError, request: Request, response: Response, next: NextFunction): void {
  let statusCode: number = ErrorCodes.InternalServerError;
  let responseMessage: string = '';

  if (error instanceof Error) {
    responseMessage = error.message;
  } else {
    logger.warn('Caught something that is not an instanceof Error:', error);
  }

  if (isEssentialProjectsError(error)) {
    statusCode = error.code;
  }

  response
    .status(statusCode)
    .send(responseMessage);
}
