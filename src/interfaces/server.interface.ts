export interface ResponseInterface {
  statusCode: number;
  message: string;
  data: { title: string; favicon: string; description: string } | null;
}
