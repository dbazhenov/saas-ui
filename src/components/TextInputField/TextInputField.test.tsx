import React, { FC } from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';
import { TextInputField } from './TextInputField';

export const FormWrapper: FC<any> = ({ children, ...props }: any) => (
  <Form onSubmit={() => {}} {...props}>
    {() => <form>{children}</form>}
  </Form>
);

describe('TextInputField::', () => {
  it('should render an input element of type text', async () => {
    render(
      <FormWrapper>
        <TextInputField name="test" />
      </FormWrapper>,
    );

    expect(await screen.findByRole('textbox')).toBeInTheDocument();
  });

  it('should show no labels if none are passed to props', () => {
    render(
      <FormWrapper>
        <TextInputField name="test" />
      </FormWrapper>,
    );

    expect(screen.queryByTestId('test-field-label')).not.toBeInTheDocument();
  });

  it('should show a label if one is passed to props', () => {
    render(
      <FormWrapper>
        <TextInputField label="test label" name="test" />
      </FormWrapper>,
    );

    expect(screen.getByTestId('test-field-label')).toHaveTextContent('test label');
  });
});
