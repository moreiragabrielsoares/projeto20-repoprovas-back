import prisma from '../database/database';

import { ICreateNewTestData } from '../types/testTypes';


export async function insertNewTest(newTestData: ICreateNewTestData) {
    
    await prisma.tests.create({
        data: newTestData
    }); 
}


export async function getAllTestsGroupedByDisciplines() {

    const testsGroupedByDisciplines = await prisma.$queryRaw`
        SELECT terms."id" as "termsId", 
            terms."number" as "term",
            (SELECT (JSON_AGG(ROW_TO_JSON(k)))
                FROM (
                    SELECT d."id" as "disciplineId", 
                        d."name" as "disciplineName",
                        (SELECT (JSON_AGG(ROW_TO_JSON(t)))
                            FROM (
                                SELECT c."id" as "categoryId", 
                                    c."name" as "categoryName",
                                    (SELECT (JSON_AGG(ROW_TO_JSON(w)))
                                        FROM (
                                            SELECT tests."id", 
                                                tests."name", 
                                                tests."pdfUrl",
                                                teachers."name" as "teacher"
                                            FROM tests
                                            JOIN "teachersDisciplines" td ON td."id" = tests."teacherDisciplineId"
                                            JOIN teachers ON teachers."id" = td."teacherId"
                                            WHERE tests."categoryId" = c."id" 
                                                AND tests."teacherDisciplineId" = td."id"
                                                AND td."disciplineId" = d."id"
                                        ) w) as "tests"
                                FROM tests
                                JOIN "categories" c ON c."id" = tests."categoryId" 
                                GROUP BY c."id", c."name"
                        ) t) as "categories"
                    FROM tests
                    JOIN "teachersDisciplines" td ON td."id" = tests."teacherDisciplineId"
                    JOIN "disciplines" d ON d."id" = td."disciplineId"
                    WHERE d."termId" = terms."id"
                    GROUP BY d."name", d."id"
            ) k) as "disciplines"
        FROM tests
        JOIN "teachersDisciplines" td ON td."id" = tests."teacherDisciplineId"
        JOIN "disciplines" d ON d."id" = td."disciplineId"
        JOIN terms ON terms."id" = d."termId" 
        GROUP BY terms."id", terms."number"
        ORDER BY terms."number" ASC;
    `

    return testsGroupedByDisciplines;
}


export async function getAllTestsGroupedByTeachers() {

    const testsGroupedByTeachers = await prisma.$queryRaw`
        SELECT teachers."id" as "teacherId", 
            teachers."name" as "teacherName",
            (SELECT (JSON_AGG(ROW_TO_JSON(k)))
                FROM (
                    SELECT c."id" as "categoryId", 
                        c."name" as "categoryName",
                        (SELECT (JSON_AGG(ROW_TO_JSON(w)))
                            FROM (
                                SELECT tests."id", 
                                    tests."name", 
                                    tests."pdfUrl",
                                    d."name" as "discipline"
                                FROM tests
                                JOIN "teachersDisciplines" td ON td."id" = tests."teacherDisciplineId"
                                JOIN "disciplines" d ON d."id" = td."disciplineId"
                                WHERE tests."categoryId" = c."id"
                                    AND td."teacherId" = teachers."id" 
                            ) w) as "tests"
                    FROM tests
                    JOIN "teachersDisciplines" td ON td."id" = tests."teacherDisciplineId"
                    JOIN "categories" c ON c."id" = tests."categoryId"
                    WHERE tests."categoryId" = c."id"
                    GROUP BY c."id", c."name"
            ) k) as "categories"
        FROM tests
        JOIN "teachersDisciplines" td ON td."id" = tests."teacherDisciplineId"
        JOIN "categories" c ON c."id" = tests."categoryId"
        JOIN teachers ON teachers."id" = td."teacherId" 
        GROUP BY teachers."id", teachers."name";
    `

    return testsGroupedByTeachers;
}

