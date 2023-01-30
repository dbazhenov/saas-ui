import { endOfToday, sub } from 'date-fns';
import { AuditObjectType, EventType } from 'core/api/types';
import { Messages } from './ActivityLog.messages';

export enum FilterType {
  EQUAL = 0,
  NOT_EQUAL = 1,
  GREATER = 2,
  GREATER_OR_EQUAL = 3,
  LESS = 4,
  LESS_OR_EQUAL = 5,
}

export enum TimestampRangeType {
  LAST_24_HOURS,
  LAST_48_HOURS,
  LAST_3_DAYS,
  LAST_WEEK,
  LAST_MONTH,
  LAST_3_MONTHS,
  LAST_6_MONTHS,
  LAST_YEAR,
}

export const timestampRange = () => ({
  [TimestampRangeType.LAST_24_HOURS]: [sub(new Date(), { hours: 24 }), endOfToday()],
  [TimestampRangeType.LAST_48_HOURS]: [sub(new Date(), { hours: 48 }), endOfToday()],
  [TimestampRangeType.LAST_3_DAYS]: [sub(new Date(), { days: 3 }), endOfToday()],
  [TimestampRangeType.LAST_WEEK]: [sub(new Date(), { weeks: 1 }), endOfToday()],
  [TimestampRangeType.LAST_MONTH]: [sub(new Date(), { months: 1 }), endOfToday()],
  [TimestampRangeType.LAST_3_MONTHS]: [sub(new Date(), { months: 3 }), endOfToday()],
  [TimestampRangeType.LAST_6_MONTHS]: [sub(new Date(), { months: 6 }), endOfToday()],
  [TimestampRangeType.LAST_YEAR]: [sub(new Date(), { years: 1 }), endOfToday()],
});

export const eventTypeMapping: Record<EventType, string> = {
  [EventType.CREATE]: Messages.eventTypeMap.CREATE,
  [EventType.UPDATE]: Messages.eventTypeMap.UPDATE,
  [EventType.DELETE]: Messages.eventTypeMap.DELETE,
  [EventType.LOG_IN]: Messages.eventTypeMap.LOG_IN,
  [EventType.LOG_OUT]: Messages.eventTypeMap.LOG_OUT,
  [EventType.CHANGE_PASSWORD]: Messages.eventTypeMap.CHANGE_PASSWORD,
};

export const auditObjectTypeMapping: Record<AuditObjectType, string> = {
  [AuditObjectType.organization_member]: Messages.auditObjectTypeMap.organization_member,
  [AuditObjectType.organization]: Messages.auditObjectTypeMap.organization,
  [AuditObjectType.inventory]: Messages.auditObjectTypeMap.inventory,
};
