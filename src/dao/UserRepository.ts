import {EntityRepository, Repository} from 'typeorm';
import * as log4js from 'log4js';
import * as config from 'config';
import {User} from '../entities/User';

@EntityRepository(User)
export class UserRepository<User> extends Repository<User> {
    private logger: log4js.Logger;

    constructor() {
        super();
        this.logger = log4js.getLogger('UserRepository');
        this.logger.level = config.get('logging.level');
    }

    public async findByEmail(email: string): Promise<User | null> {
        return this.findOne({email, status: true});
    }

}