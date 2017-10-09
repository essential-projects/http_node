/* tslint:disable:no-empty */

import {runtime} from '@essential-projects/foundation';
import {IHttpRouter} from '@essential-projects/http_contracts';
import * as Express from 'express';

export class BaseRouter implements IHttpRouter {

  private _router: Express.Router = undefined;

  public config: any = undefined;

  constructor() { }

  public get router(): Express.Router {
    if (!this._router) {
      this._router = Express.Router();
    }
    return this._router;
  }

  public get baseRoute(): string {
    const baseRoute = this.config.baseRoute;
    if (!baseRoute) {
      return '';
    }
    return baseRoute;
  }

  public initialize(): Promise<any> | any {
    return runtime.invokeAsPromiseIfPossible(this.initializeRouter, this);
  }

  public initializeRouter(): Promise<any> | any { return; }
}
