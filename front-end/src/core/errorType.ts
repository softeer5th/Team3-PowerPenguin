import { ResponseError } from './model';

export class ClientError extends Error {
  errorCode: string;

  constructor(error: ResponseError) {
    super(error.message);
    this.name = 'ClientError';
    this.errorCode = error.errorCode;
  }
}

export class ServerError extends Error {
  errorCode: string;

  constructor(error: ResponseError) {
    super(error.message);
    this.name = 'ServerError';
    this.errorCode = error.errorCode;
  }
}

export class CourseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CourseError';
  }
}
