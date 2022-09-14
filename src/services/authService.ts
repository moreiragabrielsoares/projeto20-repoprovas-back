import dotenv from 'dotenv';
import { ICreateNewSession, INewUserData, ILoginUserData, ICreateNewUserData } from '../types/authTypes';
import * as authRepository from '../repositories/authRepository';
import * as utilsFunctions from '../utils/functions';
import * as jwtFunctions from '../utils/jwtToken';


dotenv.config();


export async function signUpNewUser (newUserData: INewUserData) {

    if (newUserData.password !== newUserData.confirmPassword) {
        throw {type: 'Unprocessable', message: 'Passwords do not match'};
    }
    
    await checkDuplicateEmail(newUserData.email);

    const encryptedPassword = utilsFunctions.encryptDataWithBcrypt(newUserData.password);

    const createNewUserData: ICreateNewUserData = {email: newUserData.email, password: encryptedPassword};

    await authRepository.insertNewUser(createNewUserData);
    
    return;
}

export async function checkDuplicateEmail (email: string) {

    const user = await authRepository.findUserByEmail(email);

    if (user) {
        throw {type: 'Conflict', message: 'This email is already registered'};
    }

    return;
}

export async function loginUser (userData: ILoginUserData) {
    
    const userDB = await authRepository.findUserByEmail(userData.email);

    if (!userDB) {
        throw {type: 'NotFound', message: 'User not found'};
    }    

    if (!utilsFunctions.compareDataBcrypt(userData.password, userDB!.password)) {
        throw {type: 'Unauthorized', message: 'Wrong email or password'};
    }

    const token = jwtFunctions.generateToken(userDB.id);

    const newSessionData: ICreateNewSession = {userId: userDB.id, token};

    await authRepository.insertNewSession(newSessionData);

    return token;
}