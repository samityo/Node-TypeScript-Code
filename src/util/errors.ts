class HttpError extends Error {
    code: number = 0;
    message: string = '';

    constructor(code: number, message: string) {
        super(message);
        this.message = message;
        this.code = code;
        Error.captureStackTrace(this, HttpError);
    }

    toJSON() {
        let alt = {};

        Object.getOwnPropertyNames(this).forEach(function (key) {
            if (key !== 'stack') {
                alt[key] = this[key];
            }
        }, this);

        return alt;
    }
}

class EntityNotFound extends HttpError {
    constructor(message: string) {
        super(0, message);
        Object.setPrototypeOf(this, EntityNotFound.prototype);
    }
}

class WrongInput extends HttpError {
    constructor(message: string) {
        super(0, message);
        Object.setPrototypeOf(this, WrongInput.prototype);
    }
}

class BadRequest extends HttpError {
    constructor(message: string) {
        super(400, message);
        Object.setPrototypeOf(this, BadRequest.prototype);
    }
}

class Unauthorized extends HttpError {
    constructor(message: string) {
        super(401, message);
        Object.setPrototypeOf(this, Unauthorized.prototype);
    }
}

class AccessDenied extends HttpError {
    constructor(message: string) {
        super(403, message);
        Object.setPrototypeOf(this, AccessDenied.prototype);
    }
}

const errors = {
    wrongInput: WrongInput,
    entityNotFound: EntityNotFound,
    badRequest: BadRequest,
    unauthorized: Unauthorized,
    accessDenied: AccessDenied
};

export {WrongInput, EntityNotFound, BadRequest, AccessDenied, Unauthorized, HttpError, errors};