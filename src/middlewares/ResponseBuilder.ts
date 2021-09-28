import {injectable} from 'inversify';
import * as log4js from 'log4js';
import * as config from 'config';
import {errors} from '../util/errors';
import * as moment from 'moment';
import * as crypto from 'crypto';
import {Request, Response} from 'express';
import {ExtendedRequest, ExtendedResponse} from '../util/common';

@injectable()
export class ResponseBuilder {
    private logger: log4js.Logger;

    constructor() {
        this.logger = log4js.getLogger('ResponseBuilder');
        this.logger.level = config.get('logging.level');
    }

    public middleware(req: Request | ExtendedRequest, res: Response | ExtendedResponse | any, next: Function) {

        res.fail = (msg: string | Error) => {

            let message = msg instanceof Error ? msg.message : msg;
            for (const type in errors) {
                if (errors.hasOwnProperty(type) && msg instanceof Error && msg instanceof errors[type] && typeof res[type] === 'function') {
                    return res[type](msg.message);
                }
            }
            let resp: any = {
                success: false,
                message: message
            };
            if (process.env.NODE_ENV === 'development' && msg instanceof Error) {
                resp.stack_trace = msg.stack !== undefined ? msg.stack.split('\n').map((s) => s.trim()) : [];
            }
            res.status(500);
            res.json(resp);
        };

        res.success = (result) => {
            res.status(200);
            res.json({
                success: true,
                result: result
            });
        };

        res.entityNotFound = (message) => {
            res.status(204);
            res.json({
                success: false,
                message: message
            });
        };

        res.wrongInput = (message) => {
            res.status(422);
            res.json({
                success: false,
                message: message
            });
        };

        res.badRequest = (message) => {
            res.status(400);
            res.json({
                success: false,
                message: message
            });
        };

        res.unauthorized = (message) => {
            res.status(401);
            res.json({
                success: false,
                message: message
            });
        };

        res.accessDenied = (message) => {
            res.status(403);
            res.json({
                success: false,
                message: message
            });
        };

        res.apiNotFound = (message) => {
            res.status(404);
            res.json({
                success: false,
                message: message
            });
        };


        res.sendAsFile = (data: any, fileName: string, mimeType: string = 'application/octet-stream') => {
            res.writeHead(200, {
                'Content-Type': mimeType,
                'Content-Disposition': 'attachment; filename=' + fileName
            });
            res.end(data);
        };

        res.sendAsImage = (data: Buffer, mimeType: string = 'image/jpeg') => {
            const ttl = 1000 * 60 * 60 * 24 * 30;
            const hash = crypto.createHash('sha256');
            hash.update(req.originalUrl);
            let etag = hash.digest('hex').toString();
            let lastModified = moment(new Date()).format('DD, dd MM YYYY HH:mm:ss') + ' GMT';
            res.writeHead(200, {
                'ETag': etag,
                'Content-Type': mimeType,
                'Last-Modified': lastModified,
                'Content-Length': data.length,
                'Expires': moment(new Date((new Date()).getTime() + ttl)).format('DD, dd MM YYYY HH:mm:ss') + ' GMT',
                'Cache-Control': 'max-age=' + (ttl / 1000) + ', public'
            });
            res.end(data);
        };

        next();
    }
}