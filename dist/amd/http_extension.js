define(["require", "exports", "express", "bluebird", "@process-engine-js/utils", "body-parser", "@process-engine-js/core_contracts"], function (require, exports, Express, BluebirdPromise, utils_1, BodyParser, core_contracts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HttpExtension {
        constructor(container) {
            this._container = undefined;
            this._routers = {};
            this._app = undefined;
            this._server = undefined;
            this.config = undefined;
            console.log('-------------------asdasdasd-------------------');
            this._container = container;
        }
        get routers() {
            return this._routers;
        }
        get container() {
            return this._container;
        }
        get app() {
            if (!this._app) {
                this._app = Express();
            }
            return this._app;
        }
        get server() {
            return this._server;
        }
        initialize() {
            console.log('a');
            return utils_1.executeAsExtensionHookAsync(this.initializeAppExtensions, this, this.app)
                .then(() => {
                console.log('b');
                this.initializeBaseMiddleware(this.app);
                console.log('c');
                return utils_1.executeAsExtensionHookAsync(this.initializeMiddlewareBeforeRouters, this, this.app);
            })
                .then(() => {
                console.log('d');
                return this.initializeRouters();
            })
                .then(() => {
                console.log('e');
                return utils_1.executeAsExtensionHookAsync(this.initializeMiddlewareAfterRouters, this, this.app);
            });
        }
        initializeRouters() {
            let routerNames;
            const allRouterNames = this.container.getKeysByTags(core_contracts_1.RouterDiscoveryTag);
            this.container.validateDependencies();
            return utils_1.executeAsExtensionHookAsync(this.filterRouters, this, allRouterNames)
                .then((filteredRouterNames) => {
                if (typeof filteredRouterNames === 'undefined' || filteredRouterNames === null) {
                    routerNames = allRouterNames;
                }
                else {
                    if (!Array.isArray(filteredRouterNames)) {
                        throw new Error('Filtered router names must be of type Array.');
                    }
                    else if (filteredRouterNames.length === 0) {
                    }
                    routerNames = filteredRouterNames;
                }
            })
                .then(() => {
                const serialPromise = routerNames.reduce((prevPromise, routerName) => {
                    return prevPromise.then(() => {
                        return this.initializeRouter(routerName);
                    });
                }, BluebirdPromise.resolve());
                return serialPromise;
            });
        }
        initializeRouter(routerName) {
            if (!this.container.isRegistered(routerName)) {
                throw new Error(`There is no router registered for key '${routerName}'`);
            }
            const routerInstance = this.container.resolve(routerName);
            return utils_1.executeAsExtensionHookAsync(routerInstance.initialize, routerInstance)
                .then(() => {
                this.bindRoute(routerInstance);
                this.routers[routerName] = routerInstance;
            });
        }
        bindRoute(routerInstance) {
            const shieldingRouter = Express.Router();
            shieldingRouter.use(`/${routerInstance.baseRoute}/`, routerInstance.router);
            this.app.use('/', shieldingRouter);
        }
        start() {
            return new BluebirdPromise((resolve, reject) => {
                this._server = this.app.listen(this.config.server.port, this.config.server.host, () => {
                    console.log(`Started REST API ${this.config.server.host}:${this.config.server.port}`);
                    utils_1.executeAsExtensionHookAsync(this.onStarted, this)
                        .then((result) => {
                        resolve(result);
                    })
                        .catch((error) => {
                        reject(error);
                    });
                });
            });
        }
        close() {
            if (this.server) {
                this.server.close();
            }
        }
        initializeAppExtensions(app) { }
        initializeMiddlewareBeforeRouters(app) { }
        initializeMiddlewareAfterRouters(app) { }
        filterRouters(routerNames) {
            return routerNames;
        }
        onStarted() { }
        initializeBaseMiddleware(app) {
            app.use(BodyParser.json());
        }
    }
    exports.HttpExtension = HttpExtension;
});

//# sourceMappingURL=http_extension.js.map
