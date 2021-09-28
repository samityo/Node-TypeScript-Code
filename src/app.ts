import * as fs from 'fs';
import * as path from 'path';
import * as log4js from 'log4js';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

import * as config from 'config';
import {Container} from 'inversify';
import {createServer, Server} from 'http';
import {createServer as createHTTPSServer, Server as HTTPSServer} from 'https';
import {container} from './inversify.config';
import {AuthRouter, OptionsRouter, PermissionRouter, UserRouter} from './routers';
import AuthMiddleware from './middlewares/authentication/AuthMiddleware';
import {ResponseBuilder} from './middlewares/ResponseBuilder';
import {ErrorHandler} from './middlewares/ErrorHandler';
import {UserRolesRouter} from './routers/UserRolesRouter';

export class AppServer {
    public static readonly PORT: number = 8080;
    private app: express.Application;
    private server: Server | HTTPSServer;
    private port: string | number = 0;
    private container: Container = container;
    private logger: log4js.Logger;
    private certsPath = path.join(__dirname, 'config/certs', 'server');

    constructor() {
        log4js.configure({
            appenders: {
                console: {type: 'console'},
                file: {type: 'file', filename: path.join(__dirname, '/../', config.get('logging.filePath'))}
            },
            categories: {
                app: {appenders: ['file', 'console'], level: 'debug'},
                default: {appenders: ['console', 'file'], level: 'debug'}
            }
        });
        this.logger = log4js.getLogger('AppServer');
        this.logger.level = config.get('logging.level');
        this.app = express();
        this.config();
        this.listen();

    }

    private config(): void {
        this.port = process.env.PORT || AppServer.PORT;
        const app = this.getApp();
        app.use(log4js.connectLogger(this.logger, {
            level: config.get('logging.level'),
            format: ':status :method :url',
            nolog: '\\.gif|\\.jpg|\\.png$'
        }));

        app.use(bodyParser.json({
            limit: '250mb',
            verify: function (req: any, res, buf) {
                req.rawData = buf;
            }
        }));

        app.use(bodyParser.urlencoded({extended: false, limit: '1500mb'}));
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(bodyParser({limit: '1500mb'}));
        app.use(cors());
        const authMiddleware: AuthMiddleware = this.container.get<AuthMiddleware>(AuthMiddleware);
        authMiddleware.initialize(app);
        app.use(this.container.get<ResponseBuilder>(ResponseBuilder).middleware);
        this.container.get<OptionsRouter>(OptionsRouter).register(app);
        this.container.get<AuthRouter>(AuthRouter).register(app);
        this.container.get<UserRouter>(UserRouter).register(app);
        this.container.get<PermissionRouter>(PermissionRouter).register(app);
        this.container.get<UserRolesRouter>(UserRolesRouter).register(app);

        app.use(this.container.get<ErrorHandler>(ErrorHandler).middleware);
        if (config.get('ssl')) {
            const options = {
                key: fs.readFileSync(path.join(this.certsPath, 'my-server.key.pem'))
                , cert: fs.readFileSync(path.join(this.certsPath, 'my-server.crt.pem'))
                , requestCert: false
                , rejectUnauthorized: true
            };
            this.server = createHTTPSServer(options, this.app);
        } else {
            this.server = createServer(this.app);
        }
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            this.logger.info('Running server on port %s, with environment %s', this.port, process.env.NODE_ENV ? process.env.NODE_ENV : 'default');
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}
