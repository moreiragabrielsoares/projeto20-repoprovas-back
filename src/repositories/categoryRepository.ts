import prisma from '../database/database';



export async function findCategoryById(categoryId: number) {
    
    const category = await prisma.categories.findFirst({
        where: {id: categoryId}
    });
    
    return category;
}