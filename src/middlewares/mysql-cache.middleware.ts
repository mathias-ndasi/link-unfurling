import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Constants } from 'src/enum/constants.enum';
import { CustomException } from 'src/exceptions/error-exception.filter';
import { SuccessResponse } from 'src/exceptions/success-exception.filter';
import { MysqlCacheService } from 'src/services/mysql-cache.service';

@Injectable()
export class MysqlCacheMiddleware implements NestMiddleware {
  constructor(private readonly mysqlCacheService: MysqlCacheService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Validate input url.
    const url: string = req.params.url;
    const validUrlPattern =
      /(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    const validUrl = url.match(validUrlPattern);

    if (validUrl == null || !validUrl) {
      return new CustomException()
        .setMessage(Constants.INVALID_URL)
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .response();
    }

    // Get resource from our mysql cache if available
    const resource = await this.mysqlCacheService.get(url);

    if (resource) {
      return res.json(new SuccessResponse(resource).response());
    }

    next();
  }
}
