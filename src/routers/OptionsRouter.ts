import * as cors from 'cors';
import {Application, Router} from 'express';
import {injectable} from 'inversify';
import * as expressPromiseRouter from 'express-promise-router';

import {HasRoutes} from './HasRoutes';

@injectable()
export class OptionsRouter implements HasRoutes {
    private router: Router = expressPromiseRouter();

    constructor() {
        this.initRoutes();
    }

    public register(app: Application) {
        app.use('/*', this.getRoutes());
    }

    /**
     * Init routers
     */
    private initRoutes() {
        const router = this.router;
        router.options('*', cors(), function (req, res) {
            res.json({});
        });

    }

    /**
     * Get routers
     *
     * @returns {Router}
     */
    public getRoutes(): Router {
        return this.router;
    }
}
