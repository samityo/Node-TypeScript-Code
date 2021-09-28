import {injectable} from 'inversify';
import * as log4js from 'log4js';
import * as config from 'config';
import {Request, Response} from 'express';
import {ExtendedRequest, ExtendedResponse} from '../util/common';
import {HttpError} from '../util/errors';

@injectable()
export class ErrorHandler {
    private logger: log4js.Logger;

    constructor() {
        this.logger = log4js.getLogger('ErrorHandler');
        this.logger.level = config.get('logging.level');
        this.middleware = this.middleware.bind(this);
    }

    public middleware(err, req: Request | ExtendedRequest, res: Response | ExtendedResponse | any, next: Function) {
        if (err instanceof Error) {
            this.logger.debug('ErrorHandler', err);
            if ((err as any).status && (err as any).status === 404) {
                res.apiNotFound('Not Found: ' + req.url);
            } else if (err instanceof HttpError) {
                res.fail(err);
            } else {

                let respJson = {
                    message: err.message,
                    error: {}
                };
                if (process.env.NODE_ENV === 'development') {
                    respJson.error = err;
                }
                res.status((err as any).status || 500).json(respJson);

            }

        }
    }
}