export const Messages = {
  time: 'Time',
  userId: 'User ID',
  eventType: 'Event Type',
  details: 'Details',
  timeframe: {
    last24Hours: 'Last 24 hours',
    last48Hours: 'Last 48 hours',
    last3Days: 'Last 3 days',
    lastWeek: 'Last week',
    lastMonth: 'Last month',
    last3Months: 'Last 3 months',
    last6Months: 'Last 6 months',
    lastYear: 'Last year',
  },
  eventTypeMap: {
    CREATE: 'created',
    UPDATE: 'updated',
    DELETE: 'deleted',
    LOG_IN: 'has logged in',
    LOG_OUT: 'has logged out',
    CHANGE_PASSWORD: 'has changed password',
  },
  auditObjectTypeMap: {
    organization_member: 'organization member',
    organization: 'organization',
    inventory: 'inventory',
  },
};
