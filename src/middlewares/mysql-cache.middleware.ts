import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { validateUrl } from '../validations/url-validation.validation';
import { Constants } from '../enum/constants.enum';
import { CustomException } from '../exceptions/error-exception.filter';
import { SuccessResponse } from '../exceptions/success-exception.filter';
import { MysqlCacheService } from '../services/mysql-cache.service';

@Injectable()
export class MysqlCacheMiddleware implements NestMiddleware {
  private readonly logger = new Logger(MysqlCacheService.name);

  constructor(private readonly mysqlCacheService: MysqlCacheService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Validate input url.
    this.logger.log('Validating input url...');
    const url: string = req.params.url;
    const isValidUrl = validateUrl(url);

    if (!isValidUrl) {
      this.logger.error('Invalid input url...');
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
