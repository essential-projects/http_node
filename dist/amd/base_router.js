define(["require", "exports", "express", "@process-engine-js/utils"], function (require, exports, Express, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
        initializeRouter() { return; }
    }
    exports.BaseRouter = BaseRouter;
});

//# sourceMappingURL=base_router.js.map
