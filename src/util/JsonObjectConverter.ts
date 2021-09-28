import {IPropertyConverter, JsonValue} from 'ta-json';

export class JsonObjectConverter implements IPropertyConverter {

    serialize(property: any): JsonValue {
        try {
            return JSON.parse(property);
        } catch (e) {
            return null;
        }
    }

    deserialize(value: string): any {
        return JSON.stringify(value);
    }
}