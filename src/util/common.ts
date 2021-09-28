import {Request, Response} from 'express';

export interface ExtendedRequest extends Request {
    params: any;
    query: any;
    body: any;
    file: any
}

export interface ExtendedResponse extends Response {
    success(data: any): Promise<any>;

    fail(err: string | Error): any;

    entityNotFound(msg: string);

    apiNotFound(msg: string);

    wrongInput(msg: string);

    unauthorized(msg: string);

    badRequest(msg: string);

    accessDenied(msg: string);

    sendAsFile(data: any, fileName: string, mimeType?: string)

    sendAsImage(data: Buffer, mimeType?: string)
}