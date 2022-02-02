const dashboardPage = {
  constants: {
    labels: {
      expectedTableHeaders: [
        'Number',
        'Requested By',
        'Short Description',
        'Category',
        'Priority',
        'Status',
        'Creation Date',
      ],
    },
    messages: {},
    links: {},
  },
  locators: {
    ticketSection: 'dashboard-ticket-section',
    tableHeader: 'table-thead-tr',
    tableBody: 'table-tbody-tr',
    noDataTable: 'table-no-data',
    loadingOverlaySpinners: 'overlay-spinner',
  },
  links: {
    serviceNowAddress: 'https://perconadev.service-now.com/percona',
  },
};

export default dashboardPage;
