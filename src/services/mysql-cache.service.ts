import { Injectable, Logger } from '@nestjs/common';
import { ExtractedLinkDetails } from '../dto/link-unfurling.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class MysqlCacheService {
  private readonly logger = new Logger(MysqlCacheService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async set(key: string, cachePayload: ExtractedLinkDetails) {
    const existingResource = await this.prismaService.link.findUnique({
      where: {
        url: key,
      },
    });

    if (existingResource) {
      // we are going to update our cache with the given key.
      this.logger.log(`Updating resource in mysql cache with key=${key}`);
      const updatedResource = await this.update(key, cachePayload);

      return updatedResource;
    } else {
      // Inserting a new resource in our cache
      this.logger.log(`Inserting resource in mysql cache with key=${key}`);
      const newResource = await this.create(key, cachePayload);

      return newResource;
    }
  }

  async get(key: string) {
    this.logger.log(`Retrieving resource from mysql cache with key=${key}`);
    const resource = await this.getByUrl(key);

    return resource;
  }

  async del(key: string) {
    this.logger.log(`Deleting resource from mysql cache with key=${key}`);
    await this.prismaService.link.delete({
      where: {
        url: key,
      },
    });

    // Disconnect prisma
    this.prismaService.$disconnect();

    return;
  }

  private async create(url: string, cachePayload: ExtractedLinkDetails) {
    const resource = await this.prismaService.link.create({
      data: {
        url: url,
        ...cachePayload,
      },
      select: {
        title: true,
        favicon: true,
        description: true,
      },
    });

    // Disconnect prisma
    this.prismaService.$disconnect();

    return resource;
  }

  private async getByUrl(url: string) {
    const resource = await this.prismaService.link.findUnique({
      where: {
        url: url,
      },
      select: {
        title: true,
        favicon: true,
        description: true,
      },
    });

    // Disconnect prisma
    this.prismaService.$disconnect();

    return resource;
  }

  private async update(url: string, cachePayload: ExtractedLinkDetails) {
    // we are going to update our cache with the given key.
    const resource = await this.prismaService.link.update({
      where: {
        url: url,
      },
      data: {
        url: url,
        ...cachePayload,
      },
      select: {
        title: true,
        favicon: true,
        description: true,
      },
    });

    // Disconnect prisma
    this.prismaService.$disconnect();

    return resource;
  }
}
