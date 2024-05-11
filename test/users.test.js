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

  it('should can\'t login user if email wrong', async () => {
    const result = await supertest(web).post('/api/users/login').send({
      email: 'userEmailTes@mail.com',
      password: 'passwordTest'
    });

    expect(result.statusCode).toBe(401);
    expect(result.headers['set-cookie']).toBeUndefined();
    expect(result.body.message).toBe('Kredensial yang diberikan salah');

  });

  it('should can\'t login user if password wrong', async () => {
    const result = await supertest(web).post('/api/users/login').send({
      email: 'userEmailTest@mail.com',
      password: 'password'
    });

    expect(result.statusCode).toBe(401);
    expect(result.headers['set-cookie']).toBeUndefined();
    expect(result.body.message).toBe('Kredensial yang diberikan salah');

  });
})

describe('Get /api/users/:id', async () => {
  beforeAll(async () => {
    await createTestUsers();
  });

  afterAll(async () => {
    await deleteTestUsers();
  });

  it('should return detail user by id', async () => {
    const result = await supertest(web).get('/api/users/:id').set('Cookie', 'jwt');
    const cookies = result.headers['set-cookie'];

    expect(result.statusCode).toBe(201);
    expect(result.headers['set-cookie']).toBeDefined();
    expect(cookies.length).toBeGreaterThan(0);
    expect(result.body.message).toBe('User loggedin successfully');
  });

  it('should not return detail user if id not found', async () => {

  });

  it('should return unauthorized if user not login', async () => {

  });
})

describe('Patch /api/users/:userId', async () => {
  beforeAll(async () => {
    await createTestUsers();
  });

  afterAll(async () => {
    await deleteTestUsers();
  });
})
