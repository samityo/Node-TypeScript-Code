import {Application, Router} from 'express';

export interface HasRoutes {
    getRoutes(): Router;

    register(app: Application);
}