import { waitForDashboardToLoad } from './helpers/dashboardPage.helper';

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
      perconaContacts: 'Percona Contacts',
      contactsForums: 'Forums',
      contactsDiscord: 'Discord',
      contactsContactPage: 'Contacts page',
      contactsHelpEmail: 'portal-help@percona.com',
      contactsHelpEmailCustomer: 'customercare@percona.com',
    },
    messages: {
      emailCopiedClipboard: 'Email copied to clipboard',
    },
    links: {
      serviceNowAddress: 'https://perconadev.service-now.com/percona',
      perconaForum: 'https://forums.percona.com',
      perconaDiscord: 'http://per.co.na/discord',
      perconaContactPage: 'https://www.percona.com/about-percona/contact',
      perconaHelpEmail: 'mailto:portal-help@percona.com',
      perconaHelpEmailCustomer: 'mailto:customercare@percona.com',
    },
  },
  locators: {
    ticketTable: 'table',
    ticketSection: 'dashboard-ticket-section',
    tableHeader: 'table-thead-tr',
    tableBody: 'table-tbody-tr',
    noDataTable: 'table-no-data',
    loadingOverlaySpinners: 'overlay-spinner',
    emailContactLink: 'email-contact-link',
    forumContactLink: 'forum-contact-link',
    discordContactLink: 'discord-contact-link',
    contactPageLink: 'contact-page-link',
    contactMessage: 'contact-message',
    customerContactName: 'customer-contact-name',
    customerContactIcon: 'customer-contact-email-icon',
    gettingStartedContainer: 'getting-started-container',
  },
  methods: {
    waitForDashboardToLoad: () => waitForDashboardToLoad(),
  },
};

export default dashboardPage;
