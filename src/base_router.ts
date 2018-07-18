import {IHttpRouter} from '@essential-projects/http_contracts';
import * as Express from 'express';

export class BaseRouter implements IHttpRouter {

  private _router: Express.Router = undefined;

  public config: any = undefined;

  /* tslint:disable-next-line:no-empty */
  constructor() { }

  public get router(): Express.Router {
    if (!this._router) {
      this._router = Express.Router();
    }

    return this._router;
  }

  public get baseRoute(): string {
    const baseRoute: string = this.config.baseRoute;
    if (!baseRoute) {
      return '';
    }

    return baseRoute;
  }

  public initialize(): Promise<any> | any {
    return this.invokeAsPromiseIfPossible(this.initializeRouter, this);
  }

  public initializeRouter(): Promise<any> | any { return; }

  public dispose(): Promise<void> | void { return; }

  // Taken from the foundation, to remove the need for that package.
  private invokeAsPromiseIfPossible(functionToInvoke: any, invocationContext: any, invocationParameter?: Array<any>): Promise<any> {

    return new Promise((resolve: any, reject: any): void => {

      const isValidFunction: boolean = functionToInvoke !== undefined &&
                                        functionToInvoke !== null &&
                                        typeof functionToInvoke === 'function';

      if (!isValidFunction) {
        return resolve();
      }

      let result: any;
      try {
        result = functionToInvoke.call(invocationContext, invocationParameter);
      } catch (error) {
        return reject(error);
      }

      resolve(result);
    });
  }
}
