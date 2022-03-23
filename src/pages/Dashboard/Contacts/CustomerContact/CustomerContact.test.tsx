import React from 'react';
import { toast } from 'react-toastify';
import { render, screen, fireEvent } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import { CustomerContact } from './CustomerContact';

const writeText = jest.fn();

Object.assign(navigator, {
  clipboard: {
    writeText,
  },
});

const toastSuccess = jest.spyOn(toast, 'success');

const contact = {
  name: 'Test name',
  email: 'Test email',
  ticketUrl: 'Test URL',
};

xdescribe('Customer Contact', () => {
  test('renders correctly', async () => {
    const { container } = render(
      <TestContainer>
        <CustomerContact {...contact} />
      </TestContainer>,
    );

    expect(screen.getByTestId('customer-contact-name').textContent).toBe('Test name');
    expect(screen.getByTitle(contact.email)).toBeInTheDocument();
    expect(container.querySelectorAll('button').length).toBe(1);
  });

  test('copies to clipboard successfully', async () => {
    const { container } = render(
      <TestContainer>
        <CustomerContact {...contact} />
      </TestContainer>,
    );

    fireEvent.click(container.querySelectorAll('button')[0]);

    expect(toastSuccess).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledTimes(1);
  });
});
