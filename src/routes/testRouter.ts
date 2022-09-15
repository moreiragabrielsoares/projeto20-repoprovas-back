import { Router } from 'express';

import validateUser from '../middlewares/validateUser';
import validateSchema from '../middlewares/schemaValidator';
import { createNewTestSchema } from '../schemas/testSchemas';
import * as testController from '../controllers/testController';

const testRouter = Router();

testRouter.post('/tests', validateUser, validateSchema(createNewTestSchema), testController.createNewTest);
testRouter.get('/tests-disciplines', validateUser, testController.getAllTestsGroupedByDisciplines);
    
export default testRouter;