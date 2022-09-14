import joi from 'joi';
import { ICreateNewTestData } from '../types/testTypes';

// pdfUrl Regex: url that ends with .pdf
export const createNewTestSchema = joi.object<ICreateNewTestData>({
    name: joi.string().required(),
    pdfUrl: joi.string().uri().pattern(/(https?:\/\/.*\.(pdf))/).required(),
    categoryId: joi.number().integer().required(),
    teacherDisciplineId: joi.number().integer().required() 
})