import { ReactElement } from 'react';

export interface GettingStartedSectionProps {
  description: string;
  disabled?: boolean;
  isTicked?: boolean;
  linkIcon?: ReactElement;
  linkIsExternal?: boolean;
  linkText: string;
  linkTo: string;
  title: string;
  loading?: boolean;
  loadingMessage?: string;
  readMoreLink?: string;
}
