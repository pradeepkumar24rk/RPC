const STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UN_AUTHORISED: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
}

class BaseError extends Error {
    constructor(name,statusCode,description){
        super(description);
        Object.setPrototypeOf(this,new.target.prototype);
        this.name = name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this);
    }
}

//500
class APIError extends BaseError {
    constructor(name="Internal Server Error", statusCode = STATUS_CODES.INTERNAL_ERROR, description ='api error'){
        super(name,statusCode,description);
    }
}

//400
class ValidationError extends BaseError {
    constructor(description = 'Validation Error'){
        super('BAD REQUEST', STATUS_CODES.BAD_REQUEST,description);
    }
}

//403
class ForbiddenError extends BaseError {
    constructor(description = 'Forbidden Error'){
        super('FORBIDDEN', STATUS_CODES.UN_AUTHORISED,description);
    }
}

//404
class NotFoundError extends BaseError {
    constructor(description = 'Not Found'){
        super('NOT FOUND', STATUS_CODES.NOT_FOUND,description);
    } 
}

module.exports = {
    APIError,
    ValidationError,
    ForbiddenError,
    NotFoundError,
    STATUS_CODES
}