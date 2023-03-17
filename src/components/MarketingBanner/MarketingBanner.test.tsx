import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthState } from 'store/types';
import { MarketingBanner } from './MarketingBanner';
import { TestContainer } from '../TestContainer';

const userInfo = {
  email: 'test@percona.com',
  first_name: 'John',
  sub: '',
  last_name: 'Doe',
};

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => ({
    authState: { isAuthenticated: true },
  }),
}));

describe('Marketing Banner', () => {
  const setup = (state: Partial<{ auth: Partial<AuthState> }>) =>
    render(
      <TestContainer preloadedState={state}>
        <MarketingBanner userInfo={state.auth} />
      </TestContainer>,
    );

  it('should not render the marketing banner when email is empty', async () => {
    setup({ auth: { email: '' } });

    expect(screen.queryByTestId('marketing-banner')).not.toBeInTheDocument();
  });

  it('should render the marketing banner when email is set', async () => {
    setup({ auth: { email: userInfo.email } });

    expect(screen.queryByTestId('marketing-banner')).toBeInTheDocument();
  });

  it('should not render the marketing banner when email and marketing are set', async () => {
    setup({ auth: { email: userInfo.email, marketing: true } });

    expect(screen.queryByTestId('marketing-banner')).not.toBeInTheDocument();
  });
});
