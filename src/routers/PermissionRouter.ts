import {Application, Router} from 'express';
import {inject, injectable} from 'inversify';
import * as expressPromiseRouter from 'express-promise-router';
import {HasRoutes} from './HasRoutes';
import AuthMiddleware from '../middlewares/authentication/AuthMiddleware';
import {AclMiddleware} from '../middlewares/authentication/AclMiddleware';
import {ExtendedResponse} from '../util/common';
import {PermissionsService} from '../services/PermissionsService';

@injectable()
export class PermissionRouter implements HasRoutes {
    private router: Router = expressPromiseRouter();

    constructor(
        @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
        @inject(AclMiddleware) private aclService: AclMiddleware,
        @inject(PermissionsService) private permissionsService,
    ) {
        this.initRoutes();
    }

    public register(app: Application) {
        app.use('/api/permissions', this.authMiddleware.authenticate(), this.aclService.middleware(), this.getRoutes());
    }

    /**
     *  Init Routers
     */
    private initRoutes() {

        this.router.get('/', (req, res) => {
            this.permissionsService.allPermissions().then((data) => {
                return (res as ExtendedResponse).success(data);
            }).catch((e) => {
                return (res as ExtendedResponse).fail(e);
            });
        });

        this.router.post('/', (req, res) => {
            this.permissionsService.createPermission(req.body).then((data) => {
                return (res as ExtendedResponse).success(data);
            }).catch((e) => {
                return (res as ExtendedResponse).fail(e);
            });
        });

        this.router.put('/:id', (req, res) => {
            this.permissionsService.updatePermission(req.params.id, req.body).then((data) => {
                return (res as ExtendedResponse).success(data);
            }).catch((e) => {
                return (res as ExtendedResponse).fail(e);
            });
        });

        this.router.delete('/:id', (req, res) => {
            this.permissionsService.deletePermission(req.params.id).then((data) => {
                return (res as ExtendedResponse).success(data);
            }).catch((e) => {
                return (res as ExtendedResponse).fail(e);
            });
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