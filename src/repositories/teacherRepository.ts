import prisma from '../database/database';



export async function findTeacherById(teacherId: number) {
    
    const teacher = await prisma.teachers.findFirst({
        where: {id: teacherId}
    });
    
    return teacher;
}