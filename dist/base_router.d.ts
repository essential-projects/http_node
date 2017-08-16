/// <reference types="express" />
import * as Express from 'express';
import { IHttpRouter } from '@process-engine-js/http_contracts';
export declare class BaseRouter implements IHttpRouter {
    private _router;
    config: any;
    constructor();
    readonly router: Express.Router;
    readonly baseRoute: string;
    initialize(): Promise<any> | any;
    initializeRouter(): Promise<any> | any;
}
