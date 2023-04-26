import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WelcomeModal } from './WelcomeModal';

const TEST_TITLE = 'test';

describe('WelcomeModal::', () => {
  it('should render modal successfully', async () => {
    render(<WelcomeModal title={TEST_TITLE} onToggle={() => {}} isModalVisible />);

    expect(await screen.findByTestId('modal-body')).toBeInTheDocument();
    expect(await screen.findByTestId('modal-content')).toBeInTheDocument();
  });

  it('should not render modal', async () => {
    render(<WelcomeModal title={TEST_TITLE} onToggle={() => {}} isModalVisible={false} />);

    expect(screen.queryByTestId('modal-body')).toBeNull();
    expect(screen.queryByTestId('modal-content')).toBeNull();
  });

  it('should call handleToggle when clicking the Start button', async () => {
    const handleToggle = jest.fn();

    render(<WelcomeModal title={TEST_TITLE} onToggle={handleToggle} isModalVisible />);

    expect(await screen.findByTestId('modal-body')).toBeInTheDocument();
    expect(await screen.findByTestId('modal-content')).toBeInTheDocument();

    expect(handleToggle).toBeCalledTimes(0);
    userEvent.click(await screen.findByTestId('welcome-modal-start-button'));
    expect(handleToggle).toBeCalledTimes(1);
  });

  it('should call handleToggle when clicking More info button', async () => {
    const handleToggle = jest.fn();

    render(<WelcomeModal title={TEST_TITLE} onToggle={handleToggle} isModalVisible />);

    expect(handleToggle).toBeCalledTimes(0);
    userEvent.click(await screen.findByTestId('welcome-more-info-button'));
    expect(handleToggle).toBeCalledTimes(1);
  });
});
