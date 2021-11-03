import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MysqlCacheMiddleware } from '../middlewares/mysql-cache.middleware';
import { MysqlCacheService } from '../services/mysql-cache.service';
import { PrismaService } from '../services/prisma.service';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, PrismaService, MysqlCacheService],
  exports: [PrismaService, MysqlCacheService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MysqlCacheMiddleware).forRoutes(AppController);
  }
}
