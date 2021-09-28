export class TextDecoder
{

    decode(array: Uint8Array|number[]): string {
        return String.fromCharCode.apply(null, array as number[]);
    }

}