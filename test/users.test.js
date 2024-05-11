import supertest from "supertest";
import { web } from "../src/library/web";
import { createTestUsers, deleteTestUsers } from "./testUtils";

describe('Post /api/users', () => {
  afterAll(async () => {
    await deleteTestUsers();
  });

  it('should can register new user', async () => {
    const result = await supertest(web).post('/api/users').send({
      username: 'misno48',
      email: 'userEmailTest@mail.com',
      password: 'secretPassword'
    });

    expect(result.statusCode).toBe(201);
    expect(result.body.data.username).toBe('misno48');
    expect(result.body.data.email).toBe('userEmailTest@mail.com');
    expect(result.body.data.password).toBeUndefined();

  });

  it('should can\'t be register if email exists', async () => {
    const result = await supertest(web).post('/api/users').send({
      username: 'misno38',
      email: 'userEmailTest@mail.com',
      password: 'secretPassword'
    });

    expect(result.statusCode).toBe(400);
    expect(result.body.status).toBe('fail');
    expect(result.body.message).toBeDefined();
  });

  it('should can\'t be register if invalid property', async () => {
    const result = await supertest(web).post('/api/users').send({
      username: '',
      email: '',
      password: ''
    });

    expect(result.statusCode).toBe(400);
    expect(result.body.status).toBe('fail');
    expect(result.body.message).toBeDefined();

  });
});

describe('Post /api/user/login', () => {
  beforeAll(async () => {
    await createTestUsers();
  });

  afterAll(async () => {
    await deleteTestUsers();
  });

  it('should can login user', async () => {
    const result = await supertest(web).post('/api/users/login').send({
      email: 'userEmailTest@mail.com',
      password: 'passwordTest'
    });

    const cookies = result.headers['set-cookie'];

    expect(result.statusCode).toBe(201);
    expect(result.headers['set-cookie']).toBeDefined();
    expect(cookies.length).toBeGreaterThan(0);
    expect(result.body.message).toBe('User loggedin successfully');

  });

  it('should can\'t login user if valid payload', async () => {
    const result = await supertest(web).post('/api/users/login').send({
      email: 'userEmailTest@mail.com',
      password: ''
    });


    expect(result.statusCode).toBe(400);
    expect(result.body.status).toBe('fail');
    expect(result.body.message).toBeDefined();

  });

  it('should can\'t login user', async () => {
    const result = await supertest(web).post('/api/users/login').send({
      email: 'userEmailTest@mail.com',
      password: 'password'
    });

    expect(result.statusCode).toBe(401);
    expect(result.headers['set-cookie']).toBeUndefined();
    expect(result.body.message).toBe('Kredensial yang diberikan salah');

  });
})

