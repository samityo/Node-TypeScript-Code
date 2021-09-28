import * as config from 'config';
import * as jwt from 'jsonwebtoken';
import * as log4js from 'log4js';
import {inject, injectable} from 'inversify';
import {User} from '../entities/User';
import {Request} from 'express';
import {UserService} from './UserService';
import {PermissionsService} from './PermissionsService';
import {ViewModel} from '../util/ViewModel';


@injectable()
export class AuthService {

    private logger: log4js.Logger;

    constructor(
        @inject(UserService) private userService: UserService,
        @inject(PermissionsService) private permissionsService: PermissionsService
    ) {
        this.logger = log4js.getLogger('AuthService');
        this.logger.level = config.get('logging.level');
    }

    async currentUser(req: Request): Promise<User | null | undefined> {
        const userPayload = await this.parseAndVerifyJwtToken(req);
        if (userPayload) {
            return this.userService.fetchUser(userPayload.sub);
        }
        return null;
    }

    async isAuthenticated(req: Request): Promise<boolean> {
        const userPayload: any = await this.parseAndVerifyJwtToken(req);
        return userPayload && userPayload.sub !== undefined;
    }

    private async parseAndVerifyJwtToken(req): Promise<any> {
        if (!req.headers.authorization) {
            return false;
        }
        return jwt.verify(req.headers.authorization.replace(/^Bearer\s(.*)/, "$1"), config.get('jwt.secret'), {issuer: config.get('jwt.issuer')});
    }

    async loadAcl(type: string = 'api') {
        const permissions = await this.permissionsService.loadPermissions(type);
        const roles = await this.permissionsService.loadRoles();
        return {
            permissions: ViewModel.toJSON(permissions),
            roles: ViewModel.toJSON(roles),
        };
    }

    isGranted(resource): boolean {
        return true;
    }


}