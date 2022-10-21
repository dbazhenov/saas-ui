/* eslint-disable lines-between-class-members */
import { CommonPage } from '@pages/common.page';
import { Locator, Page, expect } from '@playwright/test';
import { format } from 'date-fns';

export class TicketOverview extends CommonPage {
  readonly page: Page;

  readonly tickets;

  readonly departmentName: Locator;
  readonly totalTicketNumber: Locator;
  readonly ticketOverviewContainer: Locator;
  readonly departmentTicketCount: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.tickets = [
      {
        number: 'RITM0010691',
        short_description: 'Percona SANDBOX - Business Continuity Review',
        priority: 'P3 - Normal',
        state: 'Pending - Awaiting Customer',
        create_time: '2021-05-24T21:00:02Z',
        department: 'Customer Success',
        requester: 'Ben Mildren',
        task_type: 'Requested Item',
        url: 'https://perconadev.service-now.com/percona?id=percona_ticket&table=sc_req_item&sys_id=f34377351b907c50ff8499b4bd4bcb37',
      },
      {
        number: 'PS0001184',
        short_description: 'Basic Performance/Health Audit - ENTLMT0003570(2 days)',
        priority: 'P3 - Normal',
        state: 'Open',
        create_time: '2021-03-16T02:47:41Z',
        department: 'Professional Services',
        requester: '',
        task_type: 'PS Project',
        url: 'https://perconadev.service-now.com/percona?id=percona_ticket&table=u_ps_project&sys_id=468320ab1bb26814296a0d8fea4bcbf1',
      },
      {
        number: 'CS0040813',
        short_description: 'Test short description',
        priority: 'P3',
        state: 'New',
        create_time: '2022-05-31T04:00:11Z',
        department: 'Managed Services',
        requester: 'Nailya Kutlubaeva (demo)',
        task_type: 'Case',
        url: 'https://perconadev.service-now.com/percona?id=percona_ticket&table=sn_customerservice_case&sys_id=b219f31587bb89508d75c9d8cebb35d2',
      },
    ];
    this.ticketOverviewContainer = page.locator(
      '//section[@data-testid="ticket-overview-section-container"]',
    );
    this.departmentName = page.locator('//span[@data-testid="department-name"]');
    this.totalTicketNumber = page.locator('//strong[@data-testid="total-ticket-number"]');
    this.departmentTicketCount = page.locator('//strong[@data-testid="department-ticket-count"]');
  }

  generateNumberOfTickets = (amount: number) => {
    const states = ['Pending - Awaiting Customer', 'Open', 'New', 'Scheduled', 'Authorize'];
    const departments = ['Customer Success', 'Managed Services', 'Professional Services'];
    const task_types = ['Requested Item', 'PS Project', 'Case', 'Change Request'];
    const tickets = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < amount; i++) {
      tickets.push({
        number: `TS400112${i + 1}`,
        short_description: `Test Short Description Number: ${i}`,
        priority: 'P3',
        state: states[Math.floor(Math.random() * states.length)],
        create_time: format(new Date(), "yyyy-MM-dd'T'kk:mm:ss'Z'"),
        department: departments[Math.floor(Math.random() * departments.length)],
        requester: 'Test User',
        task_type: task_types[Math.floor(Math.random() * task_types.length)],
        url: 'https://perconadev.service-now.com/percona?id=percona_ticket&table=sn_customerservice_case&sys_id=b219f31587bb89508d75c9d8cebb35d2',
      });
    }

    return tickets;
  };

  verifyTicketNumberDepartment = async (expected: string) => {
    const numberTickets: string[] = await this.departmentTicketCount.allTextContents();

    numberTickets.forEach((number) => expect(number).toEqual(expected));
  };
}
