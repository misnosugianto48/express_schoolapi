import supertest from "supertest";
import { web } from "../src/library/web";
import { createTestUsers, deleteTestUsers, getTestUser } from "./testUtils";

describe('Post /api/users', () => {
  afterAll(async () => {
    await deleteTestUsers();
  });

  it('should can register new user', async () => {
    const result = await supertest(web).post('/api/users').send({
      username: 'userTest',
      email: 'userEmailTest@mail.com',
      password: 'secretPassword'
    });

    expect(result.statusCode).toBe(201);
    expect(typeof result.body.data.userId).toBe('string');
    expect(result.body.data.password).toBeUndefined();

  });

  it('should can\'t be register if email exists', async () => {
    const result = await supertest(web).post('/api/users').send({
      username: 'misno48',
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

  it('should can\'t login user if invalid payload', async () => {
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

describe('Get /api/users/:id', () => {
  beforeAll(async () => {
    await createTestUsers();
  });

  afterAll(async () => {
    await deleteTestUsers();
  });

  it('should return detail user by id', async () => {
    const loginResult = await supertest(web).post('/api/users/login').send({
      email: 'userEmailTest@mail.com',
      password: 'passwordTest'
    });

    const cookies = loginResult.headers['set-cookie'];
    const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt'));
    const token = jwtCookie.split('=')[1];
  
    const testUser = await getTestUser();
    const result = await supertest(web)
      .get(`/api/users/${testUser.id}`)
      .set('Cookie', `jwt=${token}`);
  
    // Periksa bahwa pengaksesan detail pengguna berhasil
    expect(result.statusCode).toBe(200);
    expect(result.body.data.userId).toBe(testUser.id);
    expect(result.body.data.username).toBe(testUser.username);
    expect(result.body.data.email).toBe(testUser.email);
  });
  

  it('should not return if not enough access', async () => {
    const result = await supertest(web).get('/api/users/:id').set('Cookie', 'jtw');

    expect(result.statusCode).toBe(401);
    expect(result.headers['set-cookie']).toBeUndefined();
    expect(result.body.message).toBe('Unauthorized');
  });

  it('should return detail user by id', async () => {
    const loginResult = await supertest(web).post('/api/users/login').send({
      email: 'userEmailTest@mail.com',
      password: 'passwordTest'
    });

    const cookies = loginResult.headers['set-cookie'];
    const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt'));
    const token = jwtCookie.split('=')[1];
  
    const result = await supertest(web)
      .get(`/api/users/iser-hayfef`)
      .set('Cookie', `jwt=${token}`);
      
      expect(result.statusCode).toBe(403);
      expect(result.body.message).toBe('Forbidden: Not enough access');
  });
})

describe('Patch /api/users/:userId', () => {
  beforeEach(async () => {
    await createTestUsers();
  });

  afterEach(async () => {
    await deleteTestUsers();
  });

  it('should can update user', async () => {
    const loginResult = await supertest(web).post('/api/users/login').send({
      email: 'userEmailTest@mail.com',
      password: 'passwordTest'
    });

    const cookies = loginResult.headers['set-cookie'];
    const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt'));
    const token = jwtCookie.split('=')[1];
  
    const testUser = await getTestUser();
    const result = await supertest(web).patch(`/api/users/${testUser.id}`).send({
      username: 'newUserTest',
    }).set('Cookie', `jwt=${token}`);

    expect(result.statusCode).toBe(200);
    expect(typeof result.body.data.userId).toBe('string');
  });  

  it('should can\'t update user if not loggedin', async () => {
    const result = await supertest(web).patch('/api/users/:id').set('Cookie', 'jtw');

    expect(result.statusCode).toBe(401);
    expect(result.headers['set-cookie']).toBeUndefined();
    expect(result.body.message).toBe('Unauthorized');
  });

  it('should can\'t update user if not enough access', async () => {
    const loginResult = await supertest(web).post('/api/users/login').send({
      email: 'userEmailTest@mail.com',
      password: 'passwordTest'
    });

    const cookies = loginResult.headers['set-cookie'];
    const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt'));
    const token = jwtCookie.split('=')[1];

    const result = await supertest(web).patch(`/api/users/user-abc`).send({
      username: 'newUserTest',
    }).set('Cookie', `jwt=${token}`);

    expect(result.statusCode).toBe(403);
    expect(result.body.message).toBe('Forbidden: Not enough access');
  });  

  it('should can\'t update user if invalid property', async () => {
    const loginResult = await supertest(web).post('/api/users/login').send({
      email: 'userEmailTest@mail.com',
      password: 'passwordTest'
    });

    const cookies = loginResult.headers['set-cookie'];
    const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt'));
    const token = jwtCookie.split('=')[1];
  
    const testUser = await getTestUser();
    const result = await supertest(web).patch(`/api/users/${testUser.id}`).send({
      username: '',
    }).set('Cookie', `jwt=${token}`);

    expect(result.statusCode).toBe(400);
    expect(result.body.status).toBe('fail');
    expect(result.body.message).toBeDefined();
  }); 
})


describe('Delete /api/users/logout', () => {
  beforeAll(async () => {
    await createTestUsers();
  });

  afterAll(async () => {
    await deleteTestUsers();
  });

  it('should can delete cookie', async () => {
    const loginResult = await supertest(web).post('/api/users/login').send({
      email: 'userEmailTest@mail.com',
      password: 'passwordTest'
    });

    const cookies = loginResult.headers['set-cookie'];
    const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt'));
    const token = jwtCookie.split('=')[1];
  
    const result = await supertest(web).delete(`/api/users/logout`).set('Cookie', `jwt=${token}`);

    expect(result.statusCode).toBe(200);
    expect(result.body.message).toBe('logout successfully');
  });  

  it('should return unauthorized if user not loggedin', async () => {
    const result = await supertest(web).delete(`/api/users/logout`).set('Cookie', `jwt`);

    expect(result.headers['set-cookie']).toBeUndefined();
    expect(result.body.message).toBe('Unauthorized');
  });
})
