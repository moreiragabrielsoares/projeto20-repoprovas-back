import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();


export function generateToken (userId: number) {

    const TIME_ONE_DAY_SEC = 60*60*24;

    const jwtData = { userId };
    const jwtKey = process.env.JWT_KEY!;
    const jwtConfig = { expiresIn: TIME_ONE_DAY_SEC };
    const token = jwt.sign(jwtData, jwtKey, jwtConfig);

    return token;
}


export async function validateToken (token: string) {

    const jwtKey = process.env.JWT_KEY!;

    const jwtData = jwt.verify(token, jwtKey);
    
    return jwtData;
}