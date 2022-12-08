import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import { OrgTicket } from 'pages/Dashboard/TicketList/TicketList.types';
import * as orgSelectors from 'store/orgs/orgs.selectors';
import { getOrgTickets as getOrgTicketsMock } from 'store/orgs/__mocks__/orgs.selectors';
import { SupportTicketOverview } from './SupportTicketOverview';

const renderOverview = () =>
  render(
    <TestContainer>
      <SupportTicketOverview />
    </TestContainer>,
  );

const tickets: OrgTicket[] = getOrgTicketsMock();

jest.mock('core/api/orgs');

const getOrgTickets = jest.spyOn(orgSelectors, 'getOrgTickets');
const getOrgTicketsPending = jest.spyOn(orgSelectors, 'getOrgTicketsPending');

describe('Support ticket overview::', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with support tickets', async () => {
    getOrgTickets.mockImplementation(() => tickets);

    renderOverview();

    expect(await screen.findByTestId('overview')).toBeInTheDocument();
  });

  it('doesnt render because of no tickets', async () => {
    getOrgTicketsPending.mockImplementation(() => false);
    getOrgTickets.mockImplementation(() => []);

    const { container } = renderOverview();

    expect(container).toBeEmptyDOMElement();
  });
});
