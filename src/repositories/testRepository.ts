import prisma from '../database/database';

import { ICreateNewTestData } from '../types/testTypes';



export async function insertNewTest(newTestData: ICreateNewTestData) {
    
    await prisma.tests.create({
        data: newTestData
    }); 
}