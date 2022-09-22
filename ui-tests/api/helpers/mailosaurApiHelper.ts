import User from '@support/types/user.interface';
import faker from 'faker';
import MailosaurClient from 'mailosaur';

const mailosaurApiKey = process.env.MAILOSAUR_API_KEY;
const serverId = process.env.MAILOSAUR_UI_TESTS_SERVER_ID;

export const getMailosaurEmailAddress = (user: User): string =>
  `ui_tests_${user.firstName}${user.lastName}@${process.env.MAILOSAUR_UI_TESTS_SERVER_ID}.mailosaur.net`;

export const getRandomMailosaurEmailAddress = (): string => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  return `ui_tests_${firstName}${lastName}@${process.env.MAILOSAUR_UI_TESTS_SERVER_ID}.mailosaur.net`;
};

export const getVerificationLink = async (user: User): Promise<string> => {
  const searchCriteria = { sentTo: `${user.email}` };
  const mailosaur = new MailosaurClient(mailosaurApiKey);
  const message = await mailosaur.messages.get(serverId, searchCriteria);
  const activationLink = message.html.links[0].href;

  return Promise.resolve(activationLink);
};

export const getMailosaurMessage = async (userEmail: string, subject: string): Promise<any> => {
  const mailosaur = new MailosaurClient(mailosaurApiKey);
  const searchCriteria = { sentTo: userEmail, subject };

  return mailosaur.messages.get(serverId, searchCriteria);
};
