import User from '@support/types/user.interface';
import MailosaurClient from 'mailosaur';

const mailosaurApiKey = process.env.MAILOSAUR_API_KEY;
const serverId = process.env.MAILOSAUR_UI_TESTS_SERVER_ID;

export const getMailosaurEmailAddress = (user: User): string =>
  `ui_tests_${user.firstName}${user.lastName}@${process.env.MAILOSAUR_UI_TESTS_SERVER_ID}.mailosaur.net`;

export const getVerificationLink = async (user: User): Promise<string> => {
  const searchCriteria = { sentTo: `${user.email}` };
  const mailosaur = new MailosaurClient(mailosaurApiKey);
  const message = await mailosaur.messages.get(serverId, searchCriteria);
  const activationLink = message.html.links[0].href;

  return Promise.resolve(activationLink);
};
