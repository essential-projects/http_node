/// <reference types="node" />
import { DependencyInjectionContainer } from 'addict-ioc';
import * as Express from 'express';
import { Server } from 'http';
export declare class HttpExtension {
    private _container;
    private _routers;
    private _app;
    protected _server: Server;
    config: any;
    constructor(container: DependencyInjectionContainer);
    readonly routers: any;
    readonly container: DependencyInjectionContainer;
    readonly app: Express.Application;
    readonly server: Server;
    initialize(): Promise<void>;
    protected initializeRouters(): Promise<void>;
    protected initializeRouter(routerName: any): Promise<void>;
    protected bindRoute(routerInstance: any): void;
    start(): Promise<any>;
    close(): void;
    protected initializeAppExtensions(app: any): Promise<any> | any;
    protected initializeMiddlewareBeforeRouters(app: any): Promise<any> | any;
    protected initializeMiddlewareAfterRouters(app: any): Promise<any> | any;
    protected filterRouters(routerNames: Array<string>): Promise<Array<string>> | Array<string>;
    protected onStarted(): Promise<any> | any;
    protected initializeBaseMiddleware(app: any): void;
}
