import {inject, injectable} from 'inversify';
import * as log4js from 'log4js';
import * as config from 'config';
import * as acl from 'acl';
import {RedisBackend} from 'acl';
import * as redis from 'redis';
import {PermissionsService} from '../../services/PermissionsService';
import {Permission} from '../../entities/Permission';
import {AuthService} from '../../services/AuthService';
import {ExtendedResponse} from '../../util/common';
import {AccessDenied, Unauthorized} from '../../util/errors';
import {User} from '../../entities/User';

@injectable()
export class AclMiddleware {
    private logger: log4js.Logger;
    private _acl: acl.Acl;

    constructor(
        @inject(PermissionsService) private permissionsService: PermissionsService,
        @inject(AuthService) private authService: AuthService,
    ) {
        this.logger = log4js.getLogger('AclMiddleware');
        this.logger.level = config.get('logging.level');
        this._acl = this.createAcl();
        this.init();
    }

    /**
     * Init functionality
     *
     * @returns {Promise<void>}
     */
    private async init() {

    }

    public middleware() {
        return async (req, res, next) => {
            try {
                let permissions: Permission[] = await this.permissionsService.loadPermissions('api');

                permissions.forEach((permission: Permission) => {
                    if (permission.isGranted) {
                        this._acl.allow(permission.role, permission.resource, permission.action.toLowerCase());
                    } else {
                        this._acl.removeAllow(permission.role, permission.resource, permission.action.toLowerCase());
                    }
                });

                if (!await this.authService.isAuthenticated(req)) {
                    return (res as ExtendedResponse).fail(new Unauthorized('Unauthorized'));
                }
                const user: User | null | undefined = await this.authService.currentUser(req);
                if (!user) {
                    return (res as ExtendedResponse).fail(new Unauthorized('Unauthorized'));
                }
                const roles = user.rolesAsArray;
                const hasRoles = await this._acl.userRoles(user.id);
                if (hasRoles.length === 0) {
                    for (let i = 0; i < roles.length; i++) {
                        const role = roles[i];
                        await this._acl.addUserRoles(user.id, role);
                    }
                }
                this._acl.middleware(2, user.id).call(this, req, res, (err) => {
                    if (err) {
                        return (res as ExtendedResponse).fail(new AccessDenied('Access denied for requested resource'));
                    }
                    next();
                });

            } catch (e) {
                this.logger.error('Acl::middleware: ', e);
                next(e);
            }

        }
    }

    /**
     *  Reset functionality (Init)
     * @returns {Promise<void>}
     */
    async reset() {
        const prefix = '__acl__';
        const redisClient = new redis.RedisClient(config.get('redis'));
        const backend: RedisBackend = new acl.redisBackend(redisClient, prefix);
        backend.clean();
        return new acl(backend);
    }

    private createAcl(): acl.Acl {
        const prefix = '__acl__';
        const redisClient = new redis.RedisClient(config.get('redis'));
        return new acl(new acl.redisBackend(redisClient, prefix));
    }
}