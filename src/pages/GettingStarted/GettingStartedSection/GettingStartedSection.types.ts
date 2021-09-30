import { IconName } from '@grafana/ui';

export interface GettingStartedSectionProps {
  description: string;
  disabled?: boolean;
  isTicked?: boolean;
  linkIcon?: IconName;
  linkText: string;
  linkTo: string;
  title: string;
}
