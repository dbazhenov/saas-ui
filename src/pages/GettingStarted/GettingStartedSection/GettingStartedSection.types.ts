import { IconName } from '@grafana/ui';

export interface GettingStartedSectionProps {
  description: string;
  disabled?: boolean;
  isTicked?: boolean;
  linkIcon?: IconName;
  linkIsExternal?: boolean;
  linkText: string;
  linkTo: string;
  title: string;
  loading?: boolean;
  loadingMessage?: string;
}
