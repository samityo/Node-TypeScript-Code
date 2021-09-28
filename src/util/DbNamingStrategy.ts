import {DefaultNamingStrategy} from 'typeorm';
import * as log4js from 'log4js';
import * as config from 'config';

export class DbNamingStrategy extends DefaultNamingStrategy {
    private logger: log4js.Logger;

    constructor() {
        super();
        this.logger = log4js.getLogger('DbNamingStrategy');
        this.logger.level = config.get('logging.level');
    }


    columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
        return this.camelToSnake(propertyName, 1);
    }

    private camelToSnake = function (data, depth) {
        if (typeof data === 'object') {
            if (typeof depth === 'undefined') {
                depth = 1;
            }
            return this._processKeys(data, this._snakelize, depth);
        } else {
            return this._snakelize(data);
        }
    };

    private _snakelize(key) {
        let separator = '_';
        let split = /(?=[A-Z])/;

        return key.split(split).join(separator).toLowerCase();
    }

    private _processKeys(obj, processer, depth) {
        if (depth === 0 || !(typeof obj === 'object')) {
            return obj;
        }

        let result = {};
        let keys = Object.keys(obj);

        for (let i = 0; i < keys.length; i++) {
            result[processer(keys[i])] = this._processKeys(obj[keys[i]], processer, depth - 1);
        }

        return result;
    }
}