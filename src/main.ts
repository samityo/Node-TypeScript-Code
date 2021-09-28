import 'reflect-metadata';
import {AppServer} from './app';

const app = new AppServer().getApp();
export { app };
