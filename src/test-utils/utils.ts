import { randomUUID } from 'crypto';

export const User1 = {
  id: randomUUID(),
  firstName: 'Vik',
  lastName: 'Srivastava',
  email: 'vik@user.com',
  password: 'non-hashed-pw',
  isApproved: true,
  isAdmin: false,
  myPromises: [],
  othersPromises: [],
  promiseLogs: [],
};

export const User2 = {
  id: randomUUID(),
  firstName: 'Nathan',
  lastName: 'Chan',
  email: 'nathan@user.com',
  password: 'non-hashed-pw',
  isApproved: false,
  isAdmin: false,
  myPromises: [],
  othersPromises: [],
  promiseLogs: [],
};

export const Admin1 = {
  id: randomUUID(),
  firstName: 'Jodi',
  lastName: 'Chan',
  email: 'jodi@admin.com',
  password: 'non-hashed-pw',
  isApproved: true,
  isAdmin: true,
  myPromises: [],
  othersPromises: [],
  promiseLogs: [],
};
