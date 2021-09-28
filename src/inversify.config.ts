import {Container} from 'inversify';
import {Console} from './console/Console';
import {OrmService} from './services/OrmService';
import {UserService} from './services/UserService';
import {AuthService} from './services/AuthService';
import {AuthRouter, OptionsRouter, PermissionRouter, UserRouter} from './routers';
import AuthMiddleware from './middlewares/authentication/AuthMiddleware';
import {ResponseBuilder} from './middlewares/ResponseBuilder';
import {ErrorHandler} from './middlewares/ErrorHandler';
import {PermissionsService} from './services/PermissionsService';
import {AclMiddleware} from './middlewares/authentication/AclMiddleware';
import {UserRolesRouter} from './routers/UserRolesRouter';

const container = new Container();

// Services
container.bind<OrmService>(OrmService).to(OrmService).inSingletonScope();
container.bind<UserService>(UserService).to(UserService);
container.bind<PermissionsService>(PermissionsService).to(PermissionsService);
container.bind<AuthService>(AuthService).to(AuthService).inRequestScope();
container.bind<AclMiddleware>(AclMiddleware).to(AclMiddleware).inRequestScope();

//routers
container.bind<AuthRouter>(AuthRouter).to(AuthRouter);
container.bind<OptionsRouter>(OptionsRouter).to(OptionsRouter);
container.bind<UserRouter>(UserRouter).to(UserRouter);
container.bind<PermissionRouter>(PermissionRouter).to(PermissionRouter);
container.bind<UserRolesRouter>(UserRolesRouter).to(UserRolesRouter);

// utils
container.bind<AuthMiddleware>(AuthMiddleware).to(AuthMiddleware);
container.bind<ResponseBuilder>(ResponseBuilder).to(ResponseBuilder);
container.bind<ErrorHandler>(ErrorHandler).to(ErrorHandler);

// Console commands
container.bind<Console>(Console).to(Console).inSingletonScope();
export {container};