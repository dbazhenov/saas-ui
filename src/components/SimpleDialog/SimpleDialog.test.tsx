import React from 'react';
import { render, screen } from '@testing-library/react';
import { SimpleDialog } from './SimpleDialog';

describe('SimpleDialog::', () => {
  it('should render modal successfully', async () => {
    render(<SimpleDialog onClose={() => {}} open title="test" actions={<></>} />);

    expect(await screen.findByTestId('modal-body')).toBeInTheDocument();
    expect(await screen.findByTestId('modal-content')).toBeInTheDocument();
  });

  it('should show the actions', async () => {
    render(<SimpleDialog onClose={() => {}} open title="test" actions={<div data-testid="action-div" />} />);

    expect(await screen.findByTestId('action-div')).toBeInTheDocument();
  });
});
