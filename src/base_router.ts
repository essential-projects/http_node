import * as Express from 'express';
import {executeAsExtensionHookAsync as extensionHook} from '@process-engine-js/utils';

export class BaseRouter {

  private _router: Express.Router = undefined;

  public config: any = undefined;

  constructor() {
    
  }

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

  protected initializeRouter(): Promise<any> | any { }
}
