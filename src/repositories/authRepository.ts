import prisma from '../database/database';
import { ICreateNewSession, ICreateNewUserData } from '../types/authTypes';



export async function findUserByEmail (email: string) {

    return prisma.users.findFirst({
        where: { email }
    });
}

export async function insertNewUser(newUserData: ICreateNewUserData) {
    
    await prisma.users.create({
        data: newUserData
    }); 
}

export async function insertNewSession(newSessionData: ICreateNewSession) {

    await prisma.sessions.create({
        data: newSessionData
    });
}

export async function findToken(token: string) {

    return prisma.sessions.findFirst({
        where: { token }
    });
}