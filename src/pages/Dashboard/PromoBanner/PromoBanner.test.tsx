import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import { PromoBanner } from './PromoBanner';

const redirectUrl =
  'https://www.percona.com/software/pmm/quickstart?utm_source=portal&utm_medium=banner&utm_id=pmminstall';

describe('Profile Page', () => {
  test('renders promo banner', async () => {
    render(
      <TestContainer>
        <PromoBanner />
      </TestContainer>,
    );

    expect(await screen.findByTestId('promo-section')).toBeInTheDocument();
  });

  test('renders link in promo banner', async () => {
    render(
      <TestContainer>
        <PromoBanner />
      </TestContainer>,
    );

    expect(await screen.findByTestId('promo-link')).toBeInTheDocument();
  });

  test(`should navigate to ${redirectUrl} when link is clicked`, async () => {
    render(
      <TestContainer>
        <PromoBanner />
      </TestContainer>,
    );

    const link = await screen.findByTestId('promo-link');

    fireEvent.click(link);

    expect(link.closest('a')).toHaveAttribute('href', `${redirectUrl}`);
  });
});
