import {injectable} from 'inversify';
import {JSON} from 'ta-json';

@injectable()
export class ViewModel {
    constructor() {
    }

    /**
     * @param {Object|Array} modelData
     * @returns {Object|Array}
     */
    public static toJSON(modelData) {
        return global.JSON.parse(JSON.stringify(modelData));
    }
}