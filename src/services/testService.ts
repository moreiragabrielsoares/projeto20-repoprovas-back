import { ICreateNewTestData } from "../types/testTypes";
import * as testRepository from '../repositories/testRepository';
import * as categoryRepository from '../repositories/categoryRepository';
import * as teacherDisciplineRepository from '../repositories/teacherDisciplineRepository';


export async function createNewTest (newTestData: ICreateNewTestData) {

    const category = await categoryRepository.findCategoryById(newTestData.categoryId);
    if (!category) {
        throw {type: 'NotFound', message: 'NotFound categoryId'};
    }

    const teacherDiscipline = await teacherDisciplineRepository.findTeacherDisciplineById(newTestData.teacherDisciplineId);
    if (!teacherDiscipline) {
        throw {type: 'NotFound', message: 'NotFound teacherDisciplineId'};
    }
    
    await testRepository.insertNewTest(newTestData);
    
    return;
}