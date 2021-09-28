import {Application, Router} from 'express';
import {inject, injectable} from 'inversify';
import * as expressPromiseRouter from 'express-promise-router';
import {HasRoutes} from './HasRoutes';
import {ExtendedResponse} from '../util/common';
import {UserService} from '../services/UserService';
import AuthMiddleware from '../middlewares/authentication/AuthMiddleware';
import {AclMiddleware} from '../middlewares/authentication/AclMiddleware';

@injectable()
export class UserRouter implements HasRoutes {
    private router: Router = expressPromiseRouter();

    constructor(
        @inject(UserService) private userService: UserService,
        @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
        @inject(AclMiddleware) private aclService: AclMiddleware,
        // @inject(AuthService) private authService: AuthService,
    ) {
        this.initRoutes();
    }

    public register(app: Application) {
        app.use('/api/users', this.authMiddleware.authenticate(), this.aclService.middleware(), this.getRoutes());
    }

    /**
     *  Routers
     */
    private initRoutes() {
        this.router.get('/', (req, res) => {
            this.userService.getUsers().then((data) => {
                return (res as ExtendedResponse).success(data);
            }).catch((e) => {
                return (res as ExtendedResponse).fail(e);
            });
        });

        this.router.post('/', (req, res) => {
            this.userService.createUser(req.body).then((data) => {
                return (res as ExtendedResponse).success(data);
            }).catch((e) => {
                return (res as ExtendedResponse).fail(e);
            });
        });

        this.router.put('/:id', (req, res) => {
            this.userService.updateUser(req.params.id, req.body).then((data) => {
                return (res as ExtendedResponse).success(data);
            }).catch((e) => {
                return (res as ExtendedResponse).fail(e);
            });
        });

        this.router.delete('/:id', (req, res) => {
            this.userService.deleteUser(req.params.id).then((data) => {
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