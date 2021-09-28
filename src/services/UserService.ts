import * as log4js from 'log4js';
import * as bcrypt from 'bcrypt';
import * as config from 'config';
import {inject, injectable} from 'inversify';
import {User} from '../entities/User';
import {UserRepository} from '../dao/UserRepository';
import {OrmService} from './OrmService';
import {Repository} from 'typeorm';

@injectable()
export class UserService {
    private logger: log4js.Logger;
    private _userRepository: UserRepository<User>;

    constructor(
        @inject(OrmService) private orm: OrmService,
    ) {
        this.logger = log4js.getLogger('UserService');
        this.logger.level = config.get('logging.level');
    }

    private async userRepository(): Promise<UserRepository<User>> {
        try {
            this._userRepository = await this.orm.getCustomRepository<User>(UserRepository);
        }catch (e) {
            this.logger.error('userRepository error: ', e);
        }
        return this._userRepository;
    }

    /**
     * Get all users
     *
     * @returns {Promise<Array<User>>}
     */
    async getUsers(): Promise<Array<User>> {
         return (await this.userRepository()).find();
    }

    /**
     * Get one user (by id)
     *
     * @param {number} userId
     * @returns {Promise<User>}
     */
    async fetchUser(userId: number): Promise<User | null | undefined> {
        return (await this.userRepository()).findOne(userId);
    }

    /**
     * Find user by credentials
     *
     * @param {string} email
     * @param {string} password
     * @returns {Promise<User>}
     */
    async findUserByCredentials(email: string, password: string): Promise<User | null> {
        try {
            const user = await (await this.userRepository()).findByEmail(email);
            if (user === null) {
                return null;
            }

            let res = bcrypt.compareSync(password, user.password);
            if (res) {
                return user;
            }
        } catch (e) {
            this.logger.error('findUserByCredentials error: ', e);
        }
        return null;
    }

    async createUser(data: any): Promise<User> {
        return null;
    }

    async updateUser(id: number, data: any): Promise<User> {
        return null;
    }

    async deleteUser(id: number): Promise<User> {
        return null;
    }




}