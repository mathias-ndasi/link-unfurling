import { AppController } from './app.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../services/app.service';
import {
  defaultLink,
  invalidUrlResponse,
  successResponse,
} from '../stubs/response.stub';
import { validateUrl } from '../validations/url-validation.validation';

describe('AppController', () => {
  let appController: AppController;

  const mockAppService = {
    unfurlLink: jest.fn((url) => {
      const isValidUrl = validateUrl(url);

      if (!isValidUrl) {
        return invalidUrlResponse();
      }

      return successResponse();
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AppController],
      providers: [AppService],
    })
      .overrideProvider(AppService)
      .useValue(mockAppService)
      .compile();

    appController = module.get<AppController>(AppController);
  });

  it('it should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('it should return a successful unfurl link details.', async () => {
    const response = await appController.unfurlLink(defaultLink());

    expect(response).toMatchObject({
      ...successResponse,
    });
  });

  it('it should return a bad request with invalid url.', async () => {
    const response = await appController.unfurlLink('testing');

    expect(response).toMatchObject({
      ...invalidUrlResponse,
    });
    expect(mockAppService.unfurlLink).toHaveBeenCalled();
  });
});
