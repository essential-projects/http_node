"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const utils_1 = require("@process-engine-js/utils");
class BaseRouter {
    constructor() {
        this._router = undefined;
        this.config = undefined;
    }
    get router() {
        if (!this._router) {
            this._router = Express.Router();
        }
        return this._router;
    }
    get baseRoute() {
        const baseRoute = this.config.baseRoute;
        if (!baseRoute) {
            return '';
        }
        return baseRoute;
    }
    initialize() {
        return utils_1.executeAsExtensionHookAsync(this.initializeRouter, this);
    }
    initializeRouter() { }
}
exports.BaseRouter = BaseRouter;

//# sourceMappingURL=base_router.js.map
