/* tslint:disable:no-empty */

import * as Express from 'express';
import {executeAsExtensionHookAsync as extensionHook} from '@process-engine-js/utils';
import {IHttpRouter} from '@process-engine-js/http_contracts';

export class BaseRouter implements IHttpRouter {

  private _router: Express.Router = undefined;

  public config: any = undefined;

  constructor() { }

  get router(): Express.Router {
    if (!this._router) {
      this._router = Express.Router();
    }
    return this._router;
  }

  get baseRoute(): string {
    const baseRoute = this.config.baseRoute;
    if (!baseRoute) {
      return '';
    }
    return baseRoute;
  }

  public initialize(): Promise<any> | any {
    return extensionHook(this.initializeRouter, this);
  }

  public initializeRouter(): Promise<any> | any { }
}
