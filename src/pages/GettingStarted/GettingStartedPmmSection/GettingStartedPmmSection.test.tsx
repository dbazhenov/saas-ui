import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import { GettingStartedPmmSection } from '.';
import { Messages } from './GettingStartedPmmSection.messages';

const mockData = {
  orgs: [{
    id: '123',
    name: 'Percona',
    created_at: '20/02/2008',
  }],
};

jest.mock('use-http', () => {
  const originalModule = jest.requireActual('use-http');

  return {
    ...originalModule,
    __esModule: true,
    CachePolicies: {
      NO_CACHE: 'no-cache',
    },
    default: () => ({
      error: null,
      loading: false,
      post: () => mockData,
      data: mockData,
      response: {
        ok: true,
      },
    }),
  };
});

xdescribe('Getting Started PMM Section', () => {
  test('is visible', async () => {
    render(
      <TestContainer>
        <GettingStartedPmmSection />
      </TestContainer>,
    );

    expect(await screen.findByText(Messages.connectPMMTitle));
  });
});
