export class ClientError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ClientError';
    this.status = status;
  }
}

export class ServerError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ServerError';
    this.status = status;
  }
}

export class CourseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CourseError';
  }
}
