import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import * as expressPromiseRouter from 'express-promise-router';
import * as config from 'config';
import {Application, Router} from 'express';
import {inject, injectable} from 'inversify';
import {HasRoutes} from './HasRoutes';
import {Unauthorized} from '../util/errors';
import {ExtendedResponse} from '../util/common';
import {AuthService} from '../services/AuthService';
import AuthMiddleware from '../middlewares/authentication/AuthMiddleware';

@injectable()
export class AuthRouter implements HasRoutes {
    private router: Router = expressPromiseRouter();

    constructor(
        @inject(AuthService) private authService: AuthService,
        @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
    ) {
        this.initRoutes();
    }

    public register(app: Application) {
        app.use('/api/auth', this.getRoutes());
    }

    private initRoutes() {
        const router = this.router;

        /**
         * POST
         * Login functionality
         */
        router.post('/token', function (req, res, next) {
            let grantType = 'password';
            if (req.body.grant_type && req.body.grant_type === 'refresh_token') {
                grantType = 'refresh_token';
            }

            const successAuthCallback = (err, user, info) => {
                if (err || !user) {
                    return (res as ExtendedResponse).fail(new Unauthorized("Invalid credentials are given"));
                }
                req.login(user, {session: false}, (err) => {
                    if (err) {
                        return (res as ExtendedResponse).fail(err);
                    }
                    let serializedUser = {
                        sub: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        roles: user.rolesAsArray
                    };
                    // generate a signed son web token with the contents of user object and return it in the response
                    const token = jwt.sign(serializedUser, config.get('jwt.secret'), {
                        issuer: config.get('jwt.issuer'),
                        expiresIn: config.get('oauth2.accessTokenLifetime'),
                    });
                    const refreshToken = jwt.sign({
                        sub: user.id,
                        type: 'refresh',
                    }, config.get('jwt.secret'), {
                        issuer: config.get('jwt.issuer'),
                        expiresIn: config.get('oauth2.refreshTokenLifetime'),
                    });
                    return (res as ExtendedResponse).send({
                        access_token: token.toString(),
                        token_type: 'bearer',
                        refresh_token: refreshToken.toString(),
                        expires_in: config.get('oauth2.accessTokenLifetime'),
                    });
                });
            };

            if (grantType === 'password') {
                passport.authenticate('local', {session: false}, successAuthCallback)(req, res);
            } else {
                passport.authenticate('refresh_token', {session: false}, successAuthCallback)(req, res);
            }
        });

        /**
         * Get Access Control List
         */
        router.get('/acl', this.authMiddleware.authenticate(), (req, res) => {
            return this.authService.loadAcl('web')
                .then((data) => {
                    return (res as ExtendedResponse).success(data);
                })
                .catch((err) => {
                    return (res as ExtendedResponse).fail(err);
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