import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import { GettingStarted} from './GettingStarted';

xdescribe('Getting Started', () => {
  test('is in the document', async () => {
    render(<TestContainer><GettingStarted /></TestContainer>);

    expect(await screen.findByTestId('getting-started-container')).toBeInTheDocument();
  });
});
