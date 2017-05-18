import * as Express from 'express';
export declare class BaseRouter {
    private _router;
    config: any;
    constructor();
    readonly router: Express.Router;
    readonly baseRoute: string;
    initialize(): Promise<any> | any;
    protected initializeRouter(): Promise<any> | any;
}
