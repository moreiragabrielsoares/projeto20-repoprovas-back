import prisma from '../database/database';



export async function findTermById(termId: number) {
    
    const term = await prisma.terms.findFirst({
        where: {id: termId}
    });
    
    return term;
}


export async function getAllTerms() {

    const terms = await prisma.terms.findMany({});

    return terms;
}
