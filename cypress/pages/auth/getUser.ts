import faker from 'faker';
import { generate } from 'generate-password';
import { User } from 'pages/common/interfaces/Auth';
import signUpPage from './signUp.page';

/*
Using generate-password lib due to a bug in a faker when passing a regex to a password function.
https://github.com/Marak/faker.js/issues/826
*/

const getFakeEmail = (firstName: string, lastName: string) => {
  const random = faker.datatype.number();

  return `ui_tests_${firstName.toLowerCase()}.${lastName.toLowerCase()}.${Date.now()}.${random}@test.com`;
};

const getPassword = () =>
  generate({
    length: 10,
    numbers: true,
    lowercase: true,
    uppercase: true,
    strict: true,
  });

export const getUser = (email: string = ''): User => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  return {
    email: email || getFakeEmail(firstName, lastName),
    password: getPassword(),
    firstName,
    lastName,
  };
};

export const getUserWithMailosaurEmail = (): User => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  return {
    email: signUpPage.methods.getMailosaurEmailAddress({ firstName, lastName, email: '', password: '' }),
    password: getPassword(),
    firstName,
    lastName,
  };
};
