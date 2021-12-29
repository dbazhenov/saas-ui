import faker from 'faker';
import { generate } from 'generate-password';
import { User } from 'pages/common/interfaces/Auth';

/*
Using generate-password lib due to a bug in a faker when passing a regex to a password function.
https://github.com/Marak/faker.js/issues/826
*/

const getFakeEmail = (firstName: string, lastName: string) =>
  `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${Date.now()}.${faker.datatype.number()}@test.com`;

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
