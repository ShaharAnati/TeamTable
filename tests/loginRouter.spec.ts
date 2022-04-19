process.env.MONGO_URI= 'mongodb+srv://admin:Aa123456@teamtable.mii7y.mongodb.net/TeamTable-Test'
import app from '../server/server';
import request from 'supertest';

import UserSchema from '../server/mongoose/UserSchema';

describe('Test login router functionality', () => {
    beforeAll(async () => {
        await UserSchema.deleteMany({});
    })

    it('should return 201 when registering with a non-existing user', async () => {
      const res = await request(app)
      .post('/register')
      .send({
        email: "illi2@gmail.com",
        password: "illi"
      });

      expect(res.statusCode).toEqual(201);
    })

    it('should return 409 when registering with an existing user', async () => {
      const res = await request(app)
      .post('/register')
      .send({
        email: "illi2@gmail.com",
        password: "illi"
      });

      expect(res.statusCode).toEqual(409);
    })
})