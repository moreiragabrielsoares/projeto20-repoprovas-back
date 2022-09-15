import prisma from '../database/database';



export async function findDisciplineById(disciplineId: number) {
    
    const discipline = await prisma.disciplines.findFirst({
        where: {id: disciplineId}
    });
    
    return discipline;
}