import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export function encryptDataWithBcrypt(data: string) {
    const SALT = 10;
    const encryptedData = bcrypt.hashSync(data, SALT);
    return encryptedData;
}

export function compareDataBcrypt(data: string, encryptedData: string) {
    return bcrypt.compareSync(data, encryptedData);
}