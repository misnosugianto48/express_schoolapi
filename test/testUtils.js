import { nanoid } from "nanoid";
import { prismaClient } from "../src/library/database";
import bcrypt from 'bcrypt';

export const deleteTestUsers = async () => {
  await prismaClient.user.deleteMany({
    where: {
      email: 'userEmailTest@mail.com'
    }
  });
}

const hash = await bcrypt.hash('passwordTest',10);

export const createTestUsers = async () => {
  await prismaClient.user.create({
    data: {
      id: `user-${nanoid(10)}`,
      username: 'userTest',
      email: 'userEmailTest@mail.com',
      password: hash
    }
  });
}