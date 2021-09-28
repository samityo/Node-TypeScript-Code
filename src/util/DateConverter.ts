import {IPropertyConverter, JsonValue} from 'ta-json';
import * as moment from 'moment';

export class DateConverter implements IPropertyConverter {

    serialize(property: any): JsonValue {
        return moment(property).format('YYYY-MM-DD HH:mm:ss');
    }

    deserialize(value: JsonValue): any {
        return moment(value as string, 'YYYY-MM-DD HH:mm:ss');
    }
}