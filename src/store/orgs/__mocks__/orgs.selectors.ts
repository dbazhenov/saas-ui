import { OrgTicketStatus } from 'core/api/types';

export const getOrg = () => ({
  id: 'testId',
  inventory: [
    {
      id: 'pmmId',
      name: 'pmmInstance',
      url: 'https://test.test',
    },
  ],
});

export const getOrgs = () => [
  {
    id: 'TestId',
    name: 'TestName',
    createdAt: 1,
    updatedAt: 2,
  },
];

export const getFirstOrgId = () => '1337';

export const getOrgTickets = () => [
  {
    number: '',
    description: '',
    priority: '',
    date: '',
    department: 'A',
    requester: '',
    taskType: 'X',
    url: '',
    status: OrgTicketStatus.Open,
  },
  {
    number: '',
    description: '',
    priority: '',
    date: '',
    department: 'A',
    requester: '',
    taskType: 'Y',
    url: '',
    status: OrgTicketStatus.Closed,
  },
  {
    number: '',
    description: '',
    priority: '',
    date: '',
    department: 'B',
    requester: '',
    taskType: 'X',
    url: '',
    status: OrgTicketStatus.Open,
  },
];
