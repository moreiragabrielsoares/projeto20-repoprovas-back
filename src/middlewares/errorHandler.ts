import { Request, Response, NextFunction } from 'express';

interface ErrorObj {
    type: string,
    message: string
}

const ERRORS: { [index: string]: number } = {
    BadRequest: 400,
    Unauthorized: 401,
    NotFound: 404,
    Conflict: 409,
    Unprocessable: 422
};

export default async function errorHandler(error: ErrorObj, req: Request, res: Response, next: NextFunction) {
    
    const type: string = error.type;
    let statusCode = ERRORS[type];
    if (!statusCode) {
        statusCode = 500;
    }
    return res.status(statusCode).send(error.message);
}