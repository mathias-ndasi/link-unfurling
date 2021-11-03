import { HttpStatus } from '@nestjs/common';

export class SuccessResponse {
  private message = 'success';
  private statusCode = HttpStatus.OK;
  private responseBody: {
    statusCode: number;
    message: string;
    data: any;
  } = {
    statusCode: this.statusCode,
    message: this.message,
    data: null,
  };

  constructor(data: any) {
    this.responseBody.data = data;
  }

  setMessage(message: string) {
    this.message = message;
    return this;
  }

  setStatusCode(statusCode: number) {
    this.statusCode = statusCode;
    return this;
  }

  response() {
    return this.responseBody;
  }
}
