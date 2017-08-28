/* tslint:disable:no-empty */

import {Container, IInstanceWrapper} from 'addict-ioc';
import * as Express from 'express';
import * as BluebirdPromise from 'bluebird';
import {Server} from 'http';
import {executeAsExtensionHookAsync as extensionHook} from '@process-engine-js/utils';
import * as BodyParser from 'body-parser';
import {RouterDiscoveryTag} from '@process-engine-js/core_contracts';
import {IHttpRouter, IHttpExtension} from '@process-engine-js/http_contracts';

export class HttpExtension implements IHttpExtension {

  private _container: Container<IInstanceWrapper<any>> = undefined;
  private _routers: any = {};
  private _app: Express.Application = undefined;
  protected _server: Server = undefined;

  public config: any = undefined;

  constructor(container: Container<IInstanceWrapper<any>>) {
    this._container = container;
  }

  get routers(): any {
    return this._routers;
  }

  get container(): Container<IInstanceWrapper<any>> {
    return this._container;
  }

  get app(): Express.Application {
    if (!this._app) {
      this._app = Express();
    }

    return this._app;
  }

  get server(): Server {
    return this._server;
  }

  public initialize(): Promise<void> {

    console.log('a')
    return extensionHook(this.initializeAppExtensions, this, this.app)
      .then(() => {
        console.log('b')

        this.initializeBaseMiddleware(this.app);

        console.log('c')
        return extensionHook(this.initializeMiddlewareBeforeRouters, this, this.app);
      })
      .then(() => {
        console.log('d')

        return this.initializeRouters();
      })
      .then(() => {
        console.log('e')

        return extensionHook(this.initializeMiddlewareAfterRouters, this, this.app);
      });
  }

  protected initializeRouters(): Promise<void> {

    let routerNames;

    const allRouterNames = this.container.getKeysByTags(RouterDiscoveryTag);

    this.container.validateDependencies();

    return extensionHook(this.filterRouters, this, allRouterNames)
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
          BluebirdPromise.resolve()
        );

        return serialPromise;
      });
  }

  protected async initializeRouter(routerName): Promise<void> {

    // logger.debug(`initialize ${routerName}`);

    if (!this.container.isRegistered(routerName)) {

      throw new Error(`There is no router registered for key '${routerName}'`);
    }

    console.log('before router instance resolve', routerName)
    const routerInstance = await this.container.resolveAsync<IHttpRouter>(routerName);
    console.log('after router instance resolve', routerName)

    this.bindRoute(routerInstance);
    this.routers[routerName] = routerInstance;
  }

  protected bindRoute(routerInstance: any): void {

    const shieldingRouter = Express.Router();

    shieldingRouter.use(`/${routerInstance.baseRoute}/`, routerInstance.router);

    this.app.use('/', shieldingRouter); // TODO (sm): this still needs a manual integration test
  }

  public start(): Promise<any> {
    console.log('start');
    return new BluebirdPromise((resolve, reject) => {

      this._server = this.app.listen(this.config.server.port, this.config.server.host, () => {
        console.log(`Started REST API ${this.config.server.host}:${this.config.server.port}`);

        // logger.info(`Started REST API ${this.config.server.host}:${this.config.server.port}`);

        extensionHook(this.onStarted, this)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      });

    });
  }

  public close(): void {

    if (this.server) {

      this.server.close();
    }
  }

  protected initializeAppExtensions(app): Promise<any> | any { }

  protected initializeMiddlewareBeforeRouters(app): Promise<any> | any { }

  protected initializeMiddlewareAfterRouters(app): Promise<any> | any { }

  protected filterRouters(routerNames: Array<string>): Promise<Array<string>> | Array<string> {
    return routerNames;
  }

  protected onStarted(): Promise<any> | any { }

  protected initializeBaseMiddleware(app): void {

    // app.use(ExpressLogger('combined', {
    //   stream: {
    //     write: function(message: string) {
    //       logger.info(message);
    //     }
    //   }
    // }));

    app.use(BodyParser.json());
  }
}
