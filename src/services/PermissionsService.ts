import * as log4js from 'log4js';
import * as config from 'config';
import {inject, injectable} from 'inversify';
import {OrmService} from './OrmService';
import {Repository} from 'typeorm';
import {Permission} from '../entities/Permission';
import {UserRole} from '../entities/UserRole';

@injectable()
export class PermissionsService {
    private logger: log4js.Logger;
    private _repo: Repository<Permission>;
    private _rolesRepo: Repository<UserRole>;

    constructor(
        @inject(OrmService) private orm: OrmService,
    ) {
        this.logger = log4js.getLogger('PermissionsService');
        this.logger.level = config.get('logging.level');
    }

    private async permissionRepository(): Promise<Repository<Permission>> {
        try {
            this._repo = await this.orm.getRepository<Permission>(Permission);
        } catch (e) {
            this.logger.error('premissionRepository error: ', e);
        }
        return this._repo;
    }

    private async rolesRepository(): Promise<Repository<UserRole>> {
        try {
            this._rolesRepo = await this.orm.getRepository<UserRole>(UserRole);
        } catch (e) {
            this.logger.error('rolesRepository error: ', e);
        }
        return this._rolesRepo;
    }


    async loadPermissions(type: string): Promise<Permission[]> {
        return (await this.permissionRepository()).find({type});
    }

    async allPermissions(): Promise<Permission[]> {
        return (await this.permissionRepository()).find();
    }

    async createPermission(data: any): Promise<any> {
        // TODO: add logic
        return {};
    }

    async updatePermission(id: number, data: any): Promise<any> {
        // TODO: add logic
        return {};
    }

    async deletePermission(id: number): Promise<any> {
        // TODO: add logic
        return {};
    }

    async createRole(data: any): Promise<any> {
        // TODO: add logic
        return {};
    }

    async updateRole(id: number, data: any): Promise<any> {
        // TODO: add logic
        return {};
    }

    async deleteRole(id: number): Promise<any> {
        // TODO: add logic
        return {};
    }

    async loadRoles(): Promise<UserRole[]> {
        return (await this.rolesRepository()).find();
    }

}