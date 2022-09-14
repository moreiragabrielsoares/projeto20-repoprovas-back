import { Request, Response, NextFunction } from 'express';

import * as authRepository from '../repositories/authRepository';
import * as jwtFunctions from '../utils/jwtToken';


export default async function validateUser(req: Request, res: Response, next: NextFunction) {

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if (!token) {
        throw {type: 'Unauthorized', message: 'Invalid header'};
    }

    try {
        await jwtFunctions.validateToken(token);
    } catch (error) {
        throw {type: 'Unauthorized', message: 'Invalid header'};
    }
    
    const tokenDB = await authRepository.findToken(token);

    if (!tokenDB) {
        throw {type: 'Unauthorized', message: 'Invalid header'};
    }

    res.locals.session = {userId: tokenDB.userId};
    next();
}