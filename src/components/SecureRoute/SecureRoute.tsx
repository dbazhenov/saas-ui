import React, { ComponentType, FC, HTMLAttributes } from 'react';
import { RouteProps } from 'react-router-dom';
import { SecureRoute as OktaSecureRoute } from '@okta/okta-react';
import { OnAuthRequiredFunction } from '@okta/okta-react/bundles/types/OktaContext';
import { MarketingBanner } from '../MarketingBanner/MarketingBanner';

export const SecureRoute: FC<
  {
    onAuthRequired?: OnAuthRequiredFunction;
    errorComponent?: ComponentType<{
      error: Error;
    }>;
  } & RouteProps &
    HTMLAttributes<HTMLDivElement>
> = ({ children, ...props }) => (
  <OktaSecureRoute {...props}>
    <MarketingBanner>{children}</MarketingBanner>
  </OktaSecureRoute>
);
