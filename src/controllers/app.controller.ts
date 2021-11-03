import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from '../services/app.service';

@ApiTags('App')
@Controller('parse')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':url')
  @HttpCode(HttpStatus.OK)
  async unfurlLink(@Param('url') url: string) {
    return await this.appService.unfurlLink(url);
  }
}
