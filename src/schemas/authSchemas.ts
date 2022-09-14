import joi from 'joi';
import { INewUserData, ILoginUserData } from '../types/authTypes';

// Password Regex: Minimum 10 characters, at least 1 letter, 1 number and 1 special character(@$!%*#?&)
export const signUpNewUserSchema = joi.object<INewUserData>({
    email: joi.string().email().required(),
    password: joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/).required(),
    confirmPassword: joi.string().required() 
})

export const loginSchema = joi.object<ILoginUserData>({
    email: joi.string().email().required(),
    password: joi.string().required() 
})