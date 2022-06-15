import React from 'react';
import { render } from '@testing-library/react';
import { Legend } from './Legend';
import { ICategory } from '../SupportTicketOverview';

jest.mock('core/api/orgs');

describe('Support Ticket Overview Legend::', () => {
  it('renders types of departments', () => {
    const vals: ICategory[] = [
      {
        department: 'Customer Success',
        ammount: 10,
        color: '#ff0000',
        types: ['type A', 'type B', 'type C'],
      },
      {
        department: 'Managed Services',
        ammount: 2,
        color: '#00ff00',
        types: ['type B', 'type C'],
      },
      {
        department: 'Support',
        ammount: 112,
        color: '#0000ff',
        types: [],
      },
      {
        department: 'Professional Services',
        ammount: 47,
        color: '#ffff00',
        types: ['type D', 'type F'],
      },
    ];
    const { getAllByTestId } = render(<Legend values={vals} />);
    const colors = getAllByTestId('department-color');
    const departments = getAllByTestId('department-name');
    const counts = getAllByTestId('department-ticket-count');
    const tagLists = getAllByTestId('department-tag-list');

    colors.forEach((color, i) =>
      expect(color).toHaveStyle({
        'background-color': vals[i].color,
      }),
    );
    departments.forEach((department, i) => expect(department).toHaveTextContent(vals[i].department));
    counts.forEach((count, i) => expect(count).toHaveTextContent(String(vals[i].ammount)));
    tagLists.forEach((tagList, listIndex) => {
      const tags = tagList.querySelectorAll('department-tags');

      tags.forEach((tag, tagIndex) => expect(tag).toHaveTextContent(vals[listIndex][tagIndex]));
    });
  });
});
