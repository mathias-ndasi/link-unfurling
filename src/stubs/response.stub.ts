import { ResponseInterface } from '../interfaces/server.interface';

export const successResponse = (): ResponseInterface => {
  return {
    statusCode: 200,
    message: 'success',
    data: {
      title: 'How to escape async/await hell',
      favicon: 'freecodecamp.org/news/favicon.png',
      description:
        'async/await freed us from callback hell, but people have started abusing it — leading to the birth of async/await hell. In this article, I will try to explain what async/await hell is, and I’ll also share some tips to escape it',
    },
  };
};

export const invalidUrlResponse = (): ResponseInterface => {
  return {
    statusCode: 400,
    message: "Invalid url. Probably missing 'http'.",
    data: null,
  };
};

export const defaultLink = (): string => {
  return 'https://medium.freecodecamp.org/avoiding-the-async-await-hell-c77a0fb71c4c';
};
