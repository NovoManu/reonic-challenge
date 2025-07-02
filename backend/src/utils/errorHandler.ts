import { FastifyReply } from 'fastify';

export interface ErrorResponse {
  error: string;
  details?: string;
  code?: string;
  timestamp?: string;
}

export enum ErrorType {
  VALIDATION = 400,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

export const handleError = (
  reply: FastifyReply,
  error: unknown,
  type: ErrorType = ErrorType.SERVER_ERROR
): void => {
  const timestamp = new Date().toISOString();
  let errorMessage = 'An unexpected error occurred';
  let details: string | undefined;
  
  if (error instanceof Error) {
    errorMessage = error.message;
    details = error.stack;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  
  const errorResponse: ErrorResponse = {
    error: errorMessage,
    timestamp,
  };
  
  if (details && process.env.NODE_ENV !== 'production') {
    errorResponse.details = details;
  }
  
  reply.status(type).send(errorResponse);
};

export const handleValidationError = (reply: FastifyReply, error: unknown): void => {
  handleError(reply, error, ErrorType.VALIDATION);
};

export const handleNotFoundError = (reply: FastifyReply, error: unknown): void => {
  handleError(reply, error, ErrorType.NOT_FOUND);
};

export const handleServerError = (reply: FastifyReply, error: unknown): void => {
  handleError(reply, error, ErrorType.SERVER_ERROR);
};
