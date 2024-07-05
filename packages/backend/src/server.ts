import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import { errorHandler } from './presentation/middlewares/errorHandler';
import { ServerOptions } from './core/types/serverOptions.type';
import { ApplicationError } from './core/utils/errors/applicationError';
import { router } from './compositionRoot';

export class ExpressServer {
  public readonly app = express();
  private readonly httpServer = createServer(this.app);

  constructor(private serverOptions: ServerOptions) {}

  public async start(): Promise<void> {
    this.addMiddleware();
    this.addCors();
    this.addRoutes();
    this.addErrorHandling();

    this.httpServer.listen(this.serverOptions.port, () => {
      // istanbul ignore next
      console.log(`API is listening on port ${this.serverOptions.port}`);
    });
  }

  private addMiddleware(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private addErrorHandling(): void {
    this.app.all('*', (req: Request, _res: Response, next: NextFunction): void => {
      next(ApplicationError.notFound(`Cant find ${req.originalUrl} on the server.`));
    });
    this.app.use(errorHandler);
  }

  private addCors(): void {
    this.app.use(cors());
  }

  private addRoutes(): void {
    this.app.use(router.getRoutes());
  }

  public close(): void {
    // istanbul ignore next
    this.httpServer?.close();
  }
}
