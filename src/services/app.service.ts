import { Injectable } from '@nestjs/common';
import axios from 'axios';
import cheerio from 'cheerio';
import { parseDomain, ParseResultType } from 'parse-domain';
import * as simpleUnfurl from 'simple-unfurl';
import { SuccessResponse } from '../exceptions/success-exception.filter';
import { MysqlCacheService } from './mysql-cache.service';

@Injectable()
export class AppService {
  constructor(private readonly mysqlCacheService: MysqlCacheService) {}

  async unfurlLink(url: string): Promise<any> {
    const documentObject = await this.fetchHTML(url);
    const resource = {
      title: await this.getTitle(url, documentObject),
      favicon: await this.getFavicon(url, documentObject),
      description: await this.getDescription(url, documentObject),
    };

    // Add to resource to our cache.
    await this.mysqlCacheService.set(url, resource);

    return new SuccessResponse(resource).response();
  }

  private async getFavicon(
    url: string,
    documentObject: any,
  ): Promise<string | null> {
    let favicon = null;
    const $ = await documentObject;
    const faviconUrl = $("link[rel='icon']").attr('href');

    // verify if valid complete favicon url
    try {
      new URL(faviconUrl);
      return faviconUrl;
    } catch (error) {}

    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    const parseResult = parseDomain(hostname);

    if (faviconUrl && parseResult.type === ParseResultType.Listed) {
      const { domain, topLevelDomains } = parseResult;

      if (domain && topLevelDomains)
        favicon = faviconUrl.startsWith('/')
          ? `${domain}.${topLevelDomains[0]}${faviconUrl}`
          : `${domain}.${topLevelDomains[0]}/${faviconUrl}`;
    }

    return favicon;
  }

  private async getTitle(
    url: string,
    documentObject: any,
  ): Promise<string | null> {
    const $ = await documentObject;
    let title = $('title').text();

    if (!title) {
      const pageData = await simpleUnfurl(url);
      title = pageData.title;
    }

    return title ? title : null;
  }

  private async getDescription(
    url: string,
    documentObject: any,
  ): Promise<string | null> {
    const $ = await documentObject;
    let description = null;
    const mainHTML = $('main p').text();

    try {
      description = mainHTML.split('.').slice(0, 2).join('. '); // Fetch the first two sentences from paragraph tags in the main HTML element.
    } catch (error) {
      const pageData = await simpleUnfurl(url);
      description = pageData.description;
    }

    return description;
  }

  private async fetchHTML(url: string) {
    // fetch and load HTML page from url.
    const { data } = await axios.get(url);
    return cheerio.load(data);
  }
}
