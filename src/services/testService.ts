import { ICreateNewTestData } from "../types/testTypes";
import * as testRepository from '../repositories/testRepository';
import * as categoryRepository from '../repositories/categoryRepository';
import * as teacherDisciplineRepository from '../repositories/teacherDisciplineRepository';
import * as teacherRepository from '../repositories/teacherRepository';
import * as disciplineRepository from '../repositories//disciplineRepository';
import * as termRepository from '../repositories/termRepository';


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

export async function getAllTestsGroupedByDisciplines () {

    const tests: any = await testRepository.getAllTests();

    for ( let i = 0 ; i < tests.length ; i++ ) {
        const teacherDiscipline = await teacherDisciplineRepository.findTeacherDisciplineById(tests[i].teacherDisciplineId);
        const teacherId = teacherDiscipline?.teacherId;
        const disciplineId = teacherDiscipline?.disciplineId;

        const teacher = await teacherRepository.findTeacherById(teacherId!);
        const teacherName = teacher?.name;

        const discipline = await disciplineRepository.findDisciplineById(disciplineId!);
        const disciplineName = discipline?.name;

        tests[i]["teacherId"] = teacherId;
        tests[i]["teacherName"] = teacherName;
        tests[i]["disciplineId"] = disciplineId;
        tests[i]["disciplineName"] = disciplineName;

        const term = await termRepository.findTermById(discipline!.termId);

        tests[i]["termId"] = term?.id;
        tests[i]["termNumber"] = term?.number;

        const category = await categoryRepository.findCategoryById(tests[i].categoryId);

        tests[i]["categoryName"] = category?.name;
    }

    const arrTeachersName: any = {};

    for (let i = 0; i < tests.length; i++) {
        arrTeachersName[tests[i].id] = tests[i].teacherName; 
    }

    const disciplinesGroupedByTerms: any = await testRepository.getAllDisciplinesGroupedByTerms();

    for ( let i = 0 ; i < disciplinesGroupedByTerms.length ; i++ ) {
        for (let j = 0 ; j < disciplinesGroupedByTerms[i].disciplines.length ; j++) {
            const testsGroupedByCategories: any = await testRepository.getTestsGroupedByCategoriesFilteredByTeachersDisciplineId(disciplinesGroupedByTerms[i].disciplines[j].teachersDisciplines[0].id);

            for (let k = 0 ; k < testsGroupedByCategories.length ; k++) {
                for (let w = 0 ; w < testsGroupedByCategories[k].tests.length ; w++) {
                    testsGroupedByCategories[k].tests[w]["teacherName"] = arrTeachersName[testsGroupedByCategories[k].tests[w].id];
                }
            }

            disciplinesGroupedByTerms[i].disciplines[j]["testsGroupedByCategories"] = testsGroupedByCategories;
        }
    }


    //const testsSQL = await testRepository.getAllTestsGroupedByDisciplinesSQL();
    
    return disciplinesGroupedByTerms;
}