import { HttpException, HttpStatus } from '@nestjs/common';
import { Constants } from 'src/enum/constants.enum';

export class CustomException {
  private statusCode = HttpStatus.BAD_REQUEST;
  private responseBody: {
    statusCode: number;
    message: string;
    data: any;
  } = {
    statusCode: this.statusCode,
    message: Constants.SERVER_ERROR,
    data: null,
  };

  constructor(data?: any) {
    this.responseBody.data = data ? data : null;
  }

  setMessage(message: string) {
    this.responseBody.message = message;
    return this;
  }

  setStatusCode(statusCode: number) {
    this.statusCode = statusCode;
    this.responseBody.statusCode = statusCode;
    return this;
  }

  response() {
    throw new HttpException(this.responseBody, this.statusCode);
  }
}
