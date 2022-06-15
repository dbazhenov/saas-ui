import React from 'react';
import { render } from '@testing-library/react';
import { Pie } from './Pie';
import { IPieItem, PieTypes } from './Pie.types';

describe('Pie Chart::', () => {
  it('renders pie', () => {
    const vals: IPieItem[] = [
      {
        name: 'Customer Success',
        value: 10,
        color: '#ff0000',
      },
      {
        name: 'Managed Services',
        value: 2,
        color: '#00ff00',
      },
      {
        name: 'Support',
        value: 112,
        color: '#0000ff',
      },
      {
        name: 'Professional Services',
        value: 47,
        color: '#ffff00',
      },
    ];

    const correctPaths = [
      'M-42.677643549640386,-90.43571606975775A100,100,0,0,1,-7.342142137803552,-99.73010051548273L-6.240820817133019,-84.77058543816032A85,85,0,0,0,-36.27599701719433,-76.87035865929408Z',
      'M-7.342142137803552,-99.73010051548273A100,100,0,0,1,-1.8369701987210297e-14,-100L-1.5614246689128753e-14,-85A85,85,0,0,0,-6.240820817133019,-84.77058543816032Z',
      'M6.123233995736766e-15,-100A100,100,0,1,1,-82.6977294994818,56.22353186727545L-70.29307007455952,47.79000208718413A85,85,0,1,0,5.204748896376251e-15,-85Z',
      'M-82.6977294994818,56.22353186727545A100,100,0,0,1,-42.677643549640386,-90.43571606975775L-36.27599701719433,-76.87035865929408A85,85,0,0,0,-70.29307007455952,47.79000208718413Z',
    ];

    const { container } = render(<Pie values={vals} size={200} type={PieTypes.DOUGHNUT} width={30} />);
    const paths = container.querySelectorAll('path');

    paths.forEach((path, i) => {
      expect(path).toHaveAttribute('fill', vals[i].color);
      expect(path).toHaveAttribute('d', correctPaths[i]);
    });
  });

  it('renders pie type doughnut', () => {
    const vals: IPieItem[] = [
      {
        name: 'Customer Success',
        value: 10,
        color: '#ff0000',
      },
      {
        name: 'Managed Services',
        value: 2,
        color: '#00ff00',
      },
      {
        name: 'Support',
        value: 112,
        color: '#0000ff',
      },
      {
        name: 'Professional Services',
        value: 47,
        color: '#ffff00',
      },
    ];

    const correctPaths = [
      'M-42.677643549640386,-90.43571606975775A100,100,0,0,1,-7.342142137803552,-99.73010051548273L0,0Z',
      'M-7.342142137803552,-99.73010051548273A100,100,0,0,1,-1.8369701987210297e-14,-100L0,0Z',
      'M6.123233995736766e-15,-100A100,100,0,1,1,-82.6977294994818,56.22353186727545L0,0Z',
      'M-82.6977294994818,56.22353186727545A100,100,0,0,1,-42.677643549640386,-90.43571606975775L0,0Z',
    ];

    const { container } = render(<Pie values={vals} size={200} type={PieTypes.PIE} />);
    const paths = container.querySelectorAll('path');

    paths.forEach((path, i) => {
      expect(path).toHaveAttribute('fill', vals[i].color);
      expect(path).toHaveAttribute('d', correctPaths[i]);
    });
  });
});
