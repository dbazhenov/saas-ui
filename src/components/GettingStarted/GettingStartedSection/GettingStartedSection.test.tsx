import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import doneIcon from 'assets/tick-circle.svg';
import { GettingStartedSection } from '.';
import { Messages } from './GettingStartedSection.messages';

const testTitle = 'Test title';
const testDescription = 'Test description';
const testLinkText = 'Test link';

describe('Getting Started Section', () => {
  test('renders the passed attributes', async () => {
    render(
      <TestContainer>
        <GettingStartedSection description={testDescription} title={testTitle} isTicked linkIcon="plus-circle" linkTo="/" linkText={testLinkText} />
      </TestContainer>,
    );

    const link = await screen.findByTestId('getting-started-section-link');

    expect(await screen.findByTestId('getting-started-section-header')).toHaveTextContent(testTitle);
    expect(await screen.findByTestId('getting-started-section-description')).toHaveTextContent(testDescription);
    expect(link).toHaveTextContent(testLinkText);
    expect(link).toBeEnabled();
  });

  test('shows a tick', async () => {
    render(
      <TestContainer>
        <GettingStartedSection
          description={testDescription}
          title={testTitle}
          isTicked
          linkIcon="plus-circle"
          linkTo="/"
          linkText={testLinkText}
        />
      </TestContainer>,
    );

    const header = await screen.findByTestId('getting-started-section-header');

    expect(header.firstElementChild).toHaveAttribute('alt', Messages.done);
    expect(header.firstElementChild).toHaveAttribute('src', doneIcon);
  });

  test('shows a disabled link if disabled is passed', async () => {
    render(
      <TestContainer>
        <GettingStartedSection
          description={testDescription}
          title={testTitle}
          disabled
          linkIcon="plus-circle"
          linkTo="/"
          linkText={testLinkText}
        />
      </TestContainer>,
    );

    const link = await screen.findByTestId('getting-started-section-link-button');

    expect(link).toBeDisabled();
  });

  test('open the link to target=_blank if linkIsExternal is specified', async () => {
    render(
      <TestContainer>
        <GettingStartedSection
          description={testDescription}
          title={testTitle}
          disabled
          linkIcon="plus-circle"
          linkTo="/"
          linkText={testLinkText}
          linkIsExternal
        />
      </TestContainer>,
    );

    const link = await screen.findByTestId('getting-started-section-link');

    expect(link).toHaveProperty('target', '_blank');
  });

  test('shows loading message if loading is passed ', async () => {
    render(
      <TestContainer>
        <GettingStartedSection
          description={testDescription}
          title={testTitle}
          linkIcon="plus-circle"
          linkTo="/"
          linkText={testLinkText}
          loadingMessage="Test loading"
          loading
        />
      </TestContainer>,
    );

    expect(screen.getByTestId('getting-started-section-loading').textContent).toBe('Test loading');
  });
});
