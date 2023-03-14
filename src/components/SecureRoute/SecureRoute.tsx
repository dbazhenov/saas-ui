import React, { ComponentType, FC, HTMLAttributes, useEffect, useState } from 'react';
import { RouteProps } from 'react-router-dom';
import { SecureRoute as OktaSecureRoute } from '@okta/okta-react';
import { OnAuthRequiredFunction } from '@okta/okta-react/bundles/types/OktaContext';
import { useDispatch, useSelector } from 'react-redux';
import { getUserEmail, updateUserInfoAction } from 'store/auth';
import { oktaAuth } from 'core';
import { UserClaims } from '@okta/okta-auth-js';
import { MarketingBanner } from '../MarketingBanner/MarketingBanner';

export const SecureRoute: FC<
  {
    onAuthRequired?: OnAuthRequiredFunction;
    errorComponent?: ComponentType<{
      error: Error;
    }>;
  } & RouteProps &
    HTMLAttributes<HTMLDivElement>
> = ({ children, ...props }) => {
  const dispatch = useDispatch();
  const userEmail = useSelector(getUserEmail);
  const [userInfo, setUserInfo] = useState<UserClaims | undefined>();

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await oktaAuth.getUser();

        setUserInfo(data);
        dispatch(
          updateUserInfoAction({
            email: data?.email,
            firstName: data?.given_name,
            lastName: data?.family_name,
          }),
        );
      } catch (err) {
        console.error(err);
      }
    };

    if (userEmail === '') {
      getUser();
    }
  }, [dispatch, userEmail]);

  return (
    <OktaSecureRoute {...props}>
      <MarketingBanner userInfo={userInfo}>{children}</MarketingBanner>
    </OktaSecureRoute>
  );
};
