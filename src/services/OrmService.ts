import {injectable} from 'inversify';
import * as log4js from 'log4js';
import * as config from 'config';
import {
    Connection,
    ConnectionManager,
    ConnectionOptions,
    EntityManager, EntitySchema, ObjectType,
} from 'typeorm';
import {DbNamingStrategy} from '../util/DbNamingStrategy';

@injectable()
export class OrmService {
    private _connection: Connection;
    private logger: log4js.Logger;

    constructor() {
        this.logger = log4js.getLogger('OrmService');
        this.logger.level = config.get('logging.level');
    }

    async getEntityManager(): Promise<EntityManager> {
        return (await this.getConnection()).manager;
    }

    async getRepository<Entity>(target: ObjectType<Entity> | EntitySchema<Entity> | string) {
        return (await this.getEntityManager()).getRepository<Entity>(target);
    }

    async getCustomRepository<T>(repoType: ObjectType<T>): Promise<ObjectType<T>> {
        return (await this.getEntityManager()).getCustomRepository<T>(repoType);
    }

    async getConnection(): Promise<Connection> {
        try {
            if (this._connection) {
                if (!this._connection.isConnected) {
                    await this._connection.connect();
                }
                return this._connection;
            }
            let logging = ['error'];
            if (process.env.NODE_ENV === 'development') {
                logging.push('query', 'schema');
            }
            this._connection = await (new ConnectionManager).create({
                type: 'mysql',
                host: config.get('mysql.host'),
                port: config.get('mysql.port'),
                username: config.get('mysql.username'),
                password: config.get('mysql.password'),
                database: config.get('mysql.dbname'),
                entities: [__dirname + '/../entities/*.js'],
                migrations: [__dirname + '/../migrations/*.js'],
                logging: logging,
                namingStrategy: new DbNamingStrategy(),
            } as ConnectionOptions);
            await this._connection.connect();
        } catch (e) {
            this.logger.error('OrmService construct error: ', e);
        }

        return this._connection;
    }
}