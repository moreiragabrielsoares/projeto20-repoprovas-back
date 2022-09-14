import { Router } from 'express';

import validateSchema from '../middlewares/schemaValidator';
import * as authSchemas from '../schemas/authSchemas';
import * as authController from '../controllers/authController';



const authRouter = Router();

authRouter.post('/signup', validateSchema(authSchemas.signUpNewUserSchema), authController.signUpNewUser);
authRouter.post('/login', validateSchema(authSchemas.loginSchema), authController.loginUser);

export default authRouter;