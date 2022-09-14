import { Request, Response } from 'express';

import * as authService from '../services/authService';
import { ICreateNewUserData, ILoginUserData } from '../types/authTypes';


export async function signUpNewUser(req: Request, res: Response) {

    const newUserData: ICreateNewUserData = req.body;

    await authService.signUpNewUser(newUserData);

    res.status(201).send('New register created');

}

export async function loginUser(req: Request, res: Response) {

    const userData: ILoginUserData = req.body;

    const token = await authService.loginUser(userData);

    res.status(200).send({ token });
}