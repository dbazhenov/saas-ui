import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import { SideMenu } from './SideMenu';

describe('SideMenu', () => {
  it('renders a menu with a least one section', async () => {
    render(
      <TestContainer>
        <SideMenu />
      </TestContainer>,
    );

    const sideMenu = await screen.findByTestId('side-menu');
    const section = await screen.findByTestId('side-menu-main-section');

    expect(sideMenu).toContainElement(section);
  });
});
