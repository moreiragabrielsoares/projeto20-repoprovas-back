import { Request, Response } from 'express';

import { ICreateNewTestData } from '../types/testTypes';
import * as testService from '../services/testService';



export async function createNewTest(req: Request, res: Response) {

    const newTestData: ICreateNewTestData = req.body;

    await testService.createNewTest(newTestData);

    res.status(201).send('New test created');
}