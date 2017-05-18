"use strict";
var Express = require("express");
var utils_1 = require("@process-engine-js/utils");
var BaseRouter = (function () {
    function BaseRouter() {
        this._router = undefined;
        this.config = undefined;
    }
    Object.defineProperty(BaseRouter.prototype, "router", {
        get: function () {
            if (!this._router) {
                this._router = Express.Router();
            }
            return this._router;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseRouter.prototype, "baseRoute", {
        get: function () {
            var baseRoute = this.config.baseRoute;
            if (!baseRoute) {
                return '';
            }
            return baseRoute;
        },
        enumerable: true,
        configurable: true
    });
    BaseRouter.prototype.initialize = function () {
        return utils_1.executeAsExtensionHookAsync(this.initializeRouter, this);
    };
    BaseRouter.prototype.initializeRouter = function () { };
    return BaseRouter;
}());
exports.BaseRouter = BaseRouter;

//# sourceMappingURL=base_router.js.map
