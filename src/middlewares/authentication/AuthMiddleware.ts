import {inject, injectable} from 'inversify';
import * as passport from 'passport';
import {ExtractJwt, Strategy as JwtStrategy, StrategyOptions as JwtOptions} from 'passport-jwt';
import {IStrategyOptions as LocalStrategyOptions, Strategy as LocalStrategy} from 'passport-local';
import * as config from 'config';
import {UserService} from '../../services/UserService';

@injectable()
export default class AuthMiddleware {

    constructor(
        @inject(UserService) private userService: UserService,
    ) {
        this.authenticate = this.authenticate.bind(this);
    }

    public authenticate() {
        return passport.authenticate('jwt', {session: false});
    }

    public initialize(app) {
        // init JWT authorization
        let opts: JwtOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('jwt.secret'),
            issuer: config.get('jwt.issuer'),
        };
        const userService = this.userService;
        passport.use('jwt', new JwtStrategy(opts, (jwt_payload, done) => {
            userService.fetchUser(jwt_payload.sub)
                .then((user) => {
                    if (user === null) {
                        return done('invalid token', false);
                    }
                    if (user) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                });
        }));

        opts = {
            jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
            secretOrKey: config.get('jwt.secret'),
            issuer: config.get('jwt.issuer'),
        };
        passport.use('refresh_token', new JwtStrategy(opts, (jwt_payload, done) => {
            userService.fetchUser(jwt_payload.sub)
                .then((user) => {
                    if (user === null) {
                        return done('invalid token', false);
                    }
                    if (user) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                        // or you could create a new account
                    }
                });
        }));

        const localOpts: LocalStrategyOptions = {
            usernameField: 'username',
            passwordField: 'password'
        };
        passport.use(new LocalStrategy(localOpts, (email, password, done) => {
            return userService.findUserByCredentials(email, password).then((user) => {
                if (!user) {
                    return done(null, false, {message: 'Incorrect email or password.'});
                }
                return done(null, user, {message: 'Logged In Successfully'});
            })
                .catch(err => done(err));

        }));

        app.use(passport.initialize());
    }

}
