import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from '../services/app.service';

@ApiTags('App')
@Controller('parse')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':url')
  @HttpCode(HttpStatus.OK)
  unfurlLink(@Param('url') url: string): any {
    return this.appService.unfurlLink(url);
  }
}
