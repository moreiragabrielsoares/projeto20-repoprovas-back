import supertest from 'supertest';
import app from '../src/app';
import prisma from '../src/database/database';


beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE users RESTART IDENTITY CASCADE;`;
});

describe('POST /signup', () => {
    
    it("given a valid newUser it should return 201", async () => {
        
        const body = {
          email: 'test@email.com',  
          password: '#a12345678',
          confirmPassword: '#a12345678'
        };

        const result = await supertest(app).post("/signup").send(body);

        const createdUser = await prisma.users.findUnique({
            where: { email: body.email }
        });
        
        expect(result.status).toEqual(201);
        expect(createdUser).not.toBeNull();
    });


    it("given an invalid newUser it should return 422", async () => {
        
        const body = {};

        const result = await supertest(app).post("/signup").send(body);
        
        expect(result.status).toEqual(422);
    });


    it("given newUser with diferent passwords it should return 422", async () => {
        
        const body = {
            email: 'test@email.com',  
            password: '#a12345678',
            confirmPassword: '#a99999999'
        };

        const result = await supertest(app).post("/signup").send(body);
        
        expect(result.status).toEqual(422);
    });


    it("given newUser with duplicate email it should return 409", async () => {
        
        const body = {
            email: 'test@email.com',
            password: '#a12345678',
            confirmPassword: '#a12345678'
        };

        const firstTry = await supertest(app).post("/signup").send(body);
        expect(firstTry.status).toEqual(201);

        const secondTry = await supertest(app).post("/signup").send(body);
        expect(secondTry.status).toEqual(409);
    });
});


describe('POST /login', () => {
    
    it("given valid credentials it should return 200 and token object", async () => {
        
        const signupBody = {
          email: 'test@email.com',  
          password: '#a12345678',
          confirmPassword: '#a12345678'
        };

        const loginBody = {
            email: 'test@email.com',  
            password: '#a12345678'
        };

        const signupFirst = await supertest(app).post("/signup").send(signupBody);
        expect(signupFirst.status).toEqual(201);

        const loginTest = await supertest(app).post("/login").send(loginBody);
        expect(loginTest.status).toEqual(200);
        expect(loginTest.body).toBeInstanceOf(Object);
    });


    it("given not registered email it should return 404", async () => {
        
        const signupBody = {
          email: 'test@email.com',  
          password: '#a12345678',
          confirmPassword: '#a12345678'
        };

        const loginBody = {
            email: 'notregistered@email.com',  
            password: '#a12345678'
        };

        const signupFirst = await supertest(app).post("/signup").send(signupBody);
        expect(signupFirst.status).toEqual(201);

        const loginTest = await supertest(app).post("/login").send(loginBody);
        expect(loginTest.status).toEqual(404);
    });

    it("given invalid credentials it should return 401", async () => {
        
        const signupBody = {
          email: 'test@email.com',  
          password: '#a12345678',
          confirmPassword: '#a12345678'
        };

        const loginBody = {
            email: 'test@email.com',  
            password: '#wrongpassword'
        };

        const signupFirst = await supertest(app).post("/signup").send(signupBody);
        expect(signupFirst.status).toEqual(201);

        const loginTest = await supertest(app).post("/login").send(loginBody);
        expect(loginTest.status).toEqual(401);
    });

    it("given invalid login body it should return 422", async () => {

        const loginBody = {
            email: 'notemail',  
            password: '#password'
        };

        const loginTest = await supertest(app).post("/login").send(loginBody);
        expect(loginTest.status).toEqual(422);
    });

});


afterAll(async () => {
    await prisma.$disconnect();
});