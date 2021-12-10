import React from 'react';
import { render, screen } from '@testing-library/react';
import { EntitlementsModal } from './EntitlementsModal';

const entitlements = [
  {
    number: 'ENTLMT0001028',
    name: 'Unmeasured MySQL Support - Premium - ENTLMT0001026',
    summary: '3 MySQL Servers',
    total_units: '3',
    tier: 'Tier 1',
    unlimited_units: false,
    support_level: 'Customer',
    software_families: ['MySQL'],
    start_date: '2019-10-28T00:00:00Z',
    end_date: '2021-07-01T00:00:00Z',
    platform: {
      security_advisor: true,
      config_advisor: false,
    },
  },
];

describe('Entitlements Modal', () => {
  test('renders EntitlementsModal with correct data', async () => {
    render(<EntitlementsModal entitlements={entitlements} onClose={() => {}} />);

    expect(screen.getByTestId('entitlements-wrapper').children.length).toBe(8);
    expect(screen.getByText('Unmeasured MySQL Support - Premium - ENTLMT0001026')).toBeInTheDocument();
    expect(screen.getByText('Tier 1')).toBeInTheDocument();
    expect(screen.getByText('3 MySQL Servers')).toBeInTheDocument();
    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByText(new Date('2019-10-28T00:00:00Z').toLocaleDateString())).toBeInTheDocument();
    expect(screen.getByText(new Date('2021-07-01T00:00:00Z').toLocaleDateString())).toBeInTheDocument();
  });
});
