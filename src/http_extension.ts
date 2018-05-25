/* tslint:disable:no-empty */

import {RouterDiscoveryTag} from '@essential-projects/core_contracts';
import {runtime} from '@essential-projects/foundation';
import {IHttpExtension, IHttpRouter} from '@essential-projects/http_contracts';
import {Container, IInstanceWrapper} from 'addict-ioc';
import * as bodyParser from 'body-parser';
import * as Express from 'express';
import {Server} from 'http';
import {errorHandler} from './error_handler';

export class HttpExtension implements IHttpExtension {

  private _container: Container<IInstanceWrapper<any>> = undefined;
  private _routers: any = {};
  private _app: Express.Application = undefined;
  protected _server: Server = undefined;

  public config: any = undefined;

  constructor(container: Container<IInstanceWrapper<any>>) {
    this._container = container;
  }

  public get routers(): any {
    return this._routers;
  }

  public get container(): Container<IInstanceWrapper<any>> {
    return this._container;
  }

  public get app(): Express.Application {
    if (!this._app) {
      this._app = Express();
    }

    return this._app;
  }

  public get server(): Server {
    return this._server;
  }

  public async initialize(): Promise<void> {
    await runtime.invokeAsPromiseIfPossible(this.initializeAppExtensions, this, this.app);
    this.initializeBaseMiddleware(this.app);
    await runtime.invokeAsPromiseIfPossible(this.initializeMiddlewareBeforeRouters, this, this.app);
    await this.initializeRouters();
    await runtime.invokeAsPromiseIfPossible(this.initializeMiddlewareAfterRouters, this, this.app);
  }

  protected initializeRouters(): Promise<void> {

    let routerNames: Array<string>;

    const allRouterNames: Array<string> = this.container.getKeysByTags(RouterDiscoveryTag);

    this.container.validateDependencies();

    return runtime.invokeAsPromiseIfPossible(this.filterRouters, this, allRouterNames)
      .then((filteredRouterNames) => {

        if (typeof filteredRouterNames === 'undefined' || filteredRouterNames === null) {

          routerNames = allRouterNames;

        } else {

          if (!Array.isArray(filteredRouterNames)) {

            throw new Error('Filtered router names must be of type Array.');

          } else if (filteredRouterNames.length === 0) {

            // logger.warn(`Array of filtered router names is empty. Check the filterRouters()
            //   extension hook in your http extension.`);
          }

          routerNames = filteredRouterNames;
        }
      })
      .then(() => {

        const serialPromise = routerNames.reduce(
          (prevPromise, routerName) => {

            return prevPromise.then(() => {

              return this.initializeRouter(routerName);
            });

          },
          Promise.resolve(),
        );

        return serialPromise;
      });
  }

  protected async initializeRouter(routerName: string): Promise<void> {

    // logger.debug(`initialize ${routerName}`);

    if (!this.container.isRegistered(routerName)) {

      throw new Error(`There is no router registered for key '${routerName}'`);
    }

    const routerInstance: IHttpRouter = await this.container.resolveAsync<IHttpRouter>(routerName);

    this.bindRoute(routerInstance);
    this.routers[routerName] = routerInstance;
  }

  protected bindRoute(routerInstance: any): void {

    const shieldingRouter: Express.Router = Express.Router();

    shieldingRouter.use(`/${routerInstance.baseRoute}/`, routerInstance.router);

    this.app.use('/', shieldingRouter); // TODO (sm): this still needs a manual integration test
  }

  public start(): Promise<any> {
    return new Promise((resolve: Function, reject: Function): any => {

      this._server = this.app.listen(this.config.server.port, this.config.server.host, () => {

        runtime.invokeAsPromiseIfPossible(this.onStarted, this)
          .then((result: any) => {
            resolve(result);
          })
          .catch((error: any) => {
            reject(error);
          });
      });

    });
  }

  public async close(): Promise<void> {

    for (const routerName in this.routers) {
      const router: IHttpRouter = this.routers[routerName];
      await runtime.invokeAsPromiseIfPossible(router.dispose, router);
    }

    await new Promise(async(resolve: Function, reject: Function): Promise<void> => {

      if (this.server) {
        this.server.close(() => {
          resolve();
        });
      }
    });
  }

  protected initializeAppExtensions(app): Promise<any> | any { return; }

  protected initializeMiddlewareBeforeRouters(app): Promise<any> | any { return; }

  protected initializeMiddlewareAfterRouters(app): Promise<any> | any {
    app.use(errorHandler);
  }

  protected filterRouters(routerNames: Array<string>): Promise<Array<string>> | Array<string> {
    return routerNames;
  }

  protected onStarted(): Promise<any> | any { return; }

  protected initializeBaseMiddleware(app): void {

    // app.use(ExpressLogger('combined', {
    //   stream: {
    //     write: function(message: string) {
    //       logger.info(message);
    //     }
    //   }
    // }));

    const opts: any = {};
    if (this.config && this.config.parseLimit) {
      opts.limit = this.config.parseLimit;
    }
    app.use(bodyParser.json(opts));
  }
}
