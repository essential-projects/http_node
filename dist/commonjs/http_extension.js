"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Express = require("express");
var BluebirdPromise = require("bluebird");
var utils_1 = require("@process-engine-js/utils");
var BodyParser = require("body-parser");
var core_contracts_1 = require("@process-engine-js/core_contracts");
var HttpExtension = (function () {
    function HttpExtension(container) {
        this._container = undefined;
        this._routers = {};
        this._app = undefined;
        this._server = undefined;
        this.config = undefined;
        this._container = container;
    }
    Object.defineProperty(HttpExtension.prototype, "routers", {
        get: function () {
            return this._routers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpExtension.prototype, "container", {
        get: function () {
            return this._container;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpExtension.prototype, "app", {
        get: function () {
            if (!this._app) {
                this._app = Express();
            }
            return this._app;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpExtension.prototype, "server", {
        get: function () {
            return this._server;
        },
        enumerable: true,
        configurable: true
    });
    HttpExtension.prototype.initialize = function () {
        var _this = this;
        return utils_1.executeAsExtensionHookAsync(this.initializeAppExtensions, this, this.app)
            .then(function () {
            _this.initializeBaseMiddleware(_this.app);
            return utils_1.executeAsExtensionHookAsync(_this.initializeMiddlewareBeforeRouters, _this, _this.app);
        })
            .then(function () {
            return _this.initializeRouters();
        })
            .then(function () {
            return utils_1.executeAsExtensionHookAsync(_this.initializeMiddlewareAfterRouters, _this, _this.app);
        });
    };
    HttpExtension.prototype.initializeRouters = function () {
        var _this = this;
        var routerNames;
        var allRouterNames = this.container.getKeysByTags(core_contracts_1.RouterDiscoveryTag);
        this.container.validateDependencies();
        return utils_1.executeAsExtensionHookAsync(this.filterRouters, this, allRouterNames)
            .then(function (filteredRouterNames) {
            if (typeof filteredRouterNames === 'undefined' || filteredRouterNames == null) {
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
            .then(function () {
            var serialPromise = routerNames.reduce(function (prevPromise, routerName) {
                return prevPromise.then(function () {
                    return _this.initializeRouter(routerName);
                });
            }, BluebirdPromise.resolve());
            return serialPromise;
        });
    };
    HttpExtension.prototype.initializeRouter = function (routerName) {
        var _this = this;
        if (!this.container.isRegistered(routerName)) {
            throw new Error("There is no router registered for key '" + routerName + "'");
        }
        var routerInstance = this.container.resolve(routerName);
        return utils_1.executeAsExtensionHookAsync(routerInstance.initialize, routerInstance)
            .then(function () {
            _this.bindRoute(routerInstance);
            _this.routers[routerName] = routerInstance;
        });
    };
    HttpExtension.prototype.bindRoute = function (routerInstance) {
        var shieldingRouter = Express.Router();
        shieldingRouter.use("/" + routerInstance.baseRoute + "/", routerInstance.router);
        this.app.use('/', shieldingRouter);
    };
    HttpExtension.prototype.start = function () {
        var _this = this;
        return new BluebirdPromise(function (resolve, reject) {
            _this._server = _this.app.listen(_this.config.server.port, _this.config.server.host, function () {
                console.log("Started REST API " + _this.config.server.host + ":" + _this.config.server.port);
                utils_1.executeAsExtensionHookAsync(_this.onStarted, _this)
                    .then(function (result) {
                    resolve(result);
                })
                    .catch(function (error) {
                    reject(error);
                });
            });
        });
    };
    HttpExtension.prototype.close = function () {
        if (this.server) {
            this.server.close();
        }
    };
    HttpExtension.prototype.initializeAppExtensions = function (app) { };
    HttpExtension.prototype.initializeMiddlewareBeforeRouters = function (app) { };
    HttpExtension.prototype.initializeMiddlewareAfterRouters = function (app) { };
    HttpExtension.prototype.filterRouters = function (routerNames) {
        return routerNames;
    };
    HttpExtension.prototype.onStarted = function () { };
    HttpExtension.prototype.initializeBaseMiddleware = function (app) {
        app.use(BodyParser.json());
    };
    return HttpExtension;
}());
exports.HttpExtension = HttpExtension;

//# sourceMappingURL=http_extension.js.map
