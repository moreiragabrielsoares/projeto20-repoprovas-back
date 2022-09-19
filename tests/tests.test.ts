import supertest from 'supertest';
import app from '../src/app';
import prisma from '../src/database/database';

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE users RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE tests RESTART IDENTITY;`;
});

describe('GET /tests-disciplines', () => {
    
    it("given a valid token it should return 200 and an array", async () => {
        
        const signupBody = {
            email: 'test@email.com',  
            password: '#a12345678',
            confirmPassword: '#a12345678'
        };
        
        const loginBody = {
          email: 'test@email.com',  
          password: '#a12345678'
        };

        const newTestBody = {
            name: 'name',
            pdfUrl: 'https://www.test.pdf',
            categoryId: 1,
            teacherDisciplineId: 1
        };

        const signupFirst = await supertest(app).post("/signup").send(signupBody);
        expect(signupFirst.status).toEqual(201);

        const loginSecond = await supertest(app).post("/login").send(loginBody);
        expect(loginSecond.status).toEqual(200);
        expect(loginSecond.body).toBeInstanceOf(Object);

        const token = loginSecond.body.token;

        const newTest = await supertest(app).post("/tests").set('Authorization', 'Bearer ' + token).send(newTestBody);
        expect(newTest.status).toEqual(201);

        const result = await supertest(app).get("/tests-disciplines").set('Authorization', 'Bearer ' + token);
        const countData = result.body.length;
    
        expect(result.status).toEqual(200);
        expect(result.body).toBeInstanceOf(Array);
        expect(countData).toBeGreaterThan(0);
    });


    it("given an invalid token it should return 401", async () => {

        const result = await supertest(app).get("/tests-disciplines").set('Authorization', 'Bearer ' + 'invalidToken');
        expect(result.status).toEqual(401);
    });

});


describe('GET /tests-teachers', () => {
    
    it("given a valid token it should return 200 and an array", async () => {
        
        const signupBody = {
            email: 'test@email.com',  
            password: '#a12345678',
            confirmPassword: '#a12345678'
        };
        
        const loginBody = {
          email: 'test@email.com',  
          password: '#a12345678'
        };

        const newTestBody = {
            name: 'name',
            pdfUrl: 'https://www.test.pdf',
            categoryId: 1,
            teacherDisciplineId: 1
        };

        const signupFirst = await supertest(app).post("/signup").send(signupBody);
        expect(signupFirst.status).toEqual(201);

        const loginSecond = await supertest(app).post("/login").send(loginBody);
        expect(loginSecond.status).toEqual(200);
        expect(loginSecond.body).toBeInstanceOf(Object);

        const token = loginSecond.body.token;

        const newTest = await supertest(app).post("/tests").set('Authorization', 'Bearer ' + token).send(newTestBody);
        expect(newTest.status).toEqual(201);

        const result = await supertest(app).get("/tests-teachers").set('Authorization', 'Bearer ' + token);
        const countData = result.body.length;
    
        expect(result.status).toEqual(200);
        expect(result.body).toBeInstanceOf(Array);
        expect(countData).toBeGreaterThan(0);
    });

    
    it("given an invalid token it should return 401", async () => {

        const result = await supertest(app).get("/tests-teachers").set('Authorization', 'Bearer ' + 'invalidToken');
        expect(result.status).toEqual(401);
    });

});


describe('POST /tests', () => {
    
    it("given a valid token and body it should return 201", async () => {
        
        const signupBody = {
            email: 'test@email.com',  
            password: '#a12345678',
            confirmPassword: '#a12345678'
        };
        
        const loginBody = {
          email: 'test@email.com',  
          password: '#a12345678'
        };

        const newTestBody = {
            name: 'name',
            pdfUrl: 'https://www.test.pdf',
            categoryId: 1,
            teacherDisciplineId: 1
        };

        const signupFirst = await supertest(app).post("/signup").send(signupBody);
        expect(signupFirst.status).toEqual(201);

        const loginSecond = await supertest(app).post("/login").send(loginBody);
        expect(loginSecond.status).toEqual(200);
        expect(loginSecond.body).toBeInstanceOf(Object);

        const token = loginSecond.body.token;

        const result = await supertest(app).post("/tests").set('Authorization', 'Bearer ' + token).send(newTestBody);
    
        expect(result.status).toEqual(201);
    });

    
    it("given an invalid token it should return 401", async () => {

        const result = await supertest(app).post("/tests").set('Authorization', 'Bearer ' + 'invalidToken');
        expect(result.status).toEqual(401);
    });

    it("given a valid token and invalid body it should return 422", async () => {
        
        const signupBody = {
            email: 'test@email.com',  
            password: '#a12345678',
            confirmPassword: '#a12345678'
        };
        
        const loginBody = {
          email: 'test@email.com',  
          password: '#a12345678'
        };

        const newTestBody = {
            name: 'name',
            pdfUrl: 'invalidUrl',
            categoryId: 1,
            teacherDisciplineId: 1
        };

        const signupFirst = await supertest(app).post("/signup").send(signupBody);
        expect(signupFirst.status).toEqual(201);

        const loginSecond = await supertest(app).post("/login").send(loginBody);
        expect(loginSecond.status).toEqual(200);
        expect(loginSecond.body).toBeInstanceOf(Object);

        const token = loginSecond.body.token;

        const result = await supertest(app).post("/tests").set('Authorization', 'Bearer ' + token).send(newTestBody);
    
        expect(result.status).toEqual(422);
    });

});



afterAll(async () => {
    await prisma.$disconnect();
});