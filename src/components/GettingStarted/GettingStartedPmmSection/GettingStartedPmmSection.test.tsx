import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import { GettingStartedPmmSection } from '.';
import { Messages } from './GettingStartedPmmSection.messages';

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
