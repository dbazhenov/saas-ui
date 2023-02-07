import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
// @ts-ignore
import OktaSignIn from '@okta/okta-signin-widget';
import { CircularProgress } from '@mui/material';
import { Routes } from 'core';
import { useHistory } from 'react-router-dom';
import { useStyles } from 'core/utils';
import { PRIVACY_PMM_URL } from 'core/constants';
import { getStyles } from './OktaSignInWidget.styles';
import { ContextProps, OktaSignInWidgetProps, RegistrationData } from './OktaSignInWidget.types';
import { Messages } from './OktaSignInWidget.messages';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import { ToSCheckbox } from './ToSCheckbox';

const getSignUpTosWrapper = (widgetRef: HTMLDivElement) => {
  const fieldset = widgetRef.querySelector('.o-form-fieldset-container');
  const requiredLabel = widgetRef.querySelector('.required-fields-label');

  if (!fieldset || !requiredLabel) {
    return undefined;
  }

  const container = requiredLabel.parentNode;

  if (!container) {
    return undefined;
  }

  const tosWrapper = document.createElement('div');

  tosWrapper.id = 'tos-wrapper';

  container.insertBefore(tosWrapper, requiredLabel);

  return tosWrapper;
};

const getSocialTosWrapper = (widgetRef: HTMLDivElement) => {
  const container = widgetRef.querySelector('.primary-auth-container');

  if (!container) {
    return undefined;
  }

  const tosWrapper = document.createElement('div');

  container.append(tosWrapper);

  return tosWrapper;
};

const insertToS = ({ controller }: ContextProps, widgetRef: HTMLDivElement) => {
  if (widgetRef.querySelector('.tos-label')) {
    return;
  }

  let tosWrapper;
  let content;

  if (controller === 'registration') {
    tosWrapper = getSignUpTosWrapper(widgetRef);
    const submitBtn = widgetRef.querySelector('.button-primary') as HTMLInputElement;

    content = <ToSCheckbox submitBtn={submitBtn} />;
  } else if (['idp-discovery', 'primary-auth'].includes(controller)) {
    tosWrapper = getSocialTosWrapper(widgetRef);

    content = (
      <p className="tos-label" data-testid="tos-label">
        {Messages.marketing}
        <a href={PRIVACY_PMM_URL} target="_blank" rel="noreferrer noopener" data-testid="privacy-policy-link">
          {Messages.privacyPolicy}
        </a>
        .
      </p>
    );
  }

  if (!tosWrapper || !content) {
    return;
  }

  ReactDOM.render(content, tosWrapper);
};

export const OktaSignInWidget = ({ config, onSuccess, onError }: OktaSignInWidgetProps) => {
  const styles = useStyles(getStyles);
  const { push: pushToHistory } = useHistory();
  const widgetRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState('');
  const [email, setEmail] = useState('');
  const [isWidgetLoading, setIsWidgetLoading] = useState(true);

  const widgetQuerySelector = (selector: string): HTMLElement | null | undefined =>
    widgetRef.current?.querySelector<HTMLElement>(selector);

  useEffect(() => {
    if (page === 'registration-complete') {
      const descriptionText = widgetQuerySelector('.registration-complete .desc');

      if (descriptionText) {
        descriptionText.textContent = Messages.checkYourEmail(email);
      }
    }
  }, [page, email]);

  useEffect(() => {
    if (!widgetRef.current) {
      return () => {};
    }

    config.features.registration = true;
    config.registration = {
      preSubmit: (postData: RegistrationData, onSuccessSignUp: (postData: any) => {}) => {
        setEmail(postData.email);
        postData.tos = true;
        const marketingConsent = true;

        postData.marketing = marketingConsent;
        onSuccessSignUp(postData);
      },
    };

    const handleRouting = (controller: string) => {
      if (controller === 'registration') {
        const backToSignInLink = widgetQuerySelector('.auth-footer a');

        if (backToSignInLink) {
          backToSignInLink.addEventListener('click', () => {
            pushToHistory(Routes.login);
          });
        }
      } else if (['idp-discovery', 'primary-auth'].includes(controller)) {
        const signUpLink = widgetQuerySelector('.registration-link');

        if (signUpLink) {
          signUpLink.addEventListener('click', () => {
            pushToHistory(Routes.signup);
          });
        }
      }
    };

    const widget = new OktaSignIn(config);

    widget.on('afterRender', (context: ContextProps) => {
      if (widgetRef.current === null) {
        return;
      }

      setPage(context.controller);
      handleRouting(context.controller);
      insertToS(context, widgetRef.current as HTMLDivElement);
    });

    widget.on('ready', (context: ContextProps) => {
      if (
        ['idp-discovery', 'primary-auth'].includes(context.controller) &&
        window.location.pathname === Routes.signup
      ) {
        widgetRef.current!.style.visibility = 'hidden';
      } else {
        setIsWidgetLoading(false);
      }

      if (window.location.pathname === Routes.signup) {
        const signUpLink = widgetQuerySelector('.registration-link');

        widgetRef.current!.style.visibility = 'hidden';

        if (signUpLink) {
          signUpLink.click();

          setTimeout(() => {
            widgetRef.current!.style.visibility = 'visible';
            setIsWidgetLoading(false);
          }, 1300);
        }
      }
    });

    widget
      .showSignInToGetTokens({
        el: widgetRef.current,
      })
      .then(onSuccess)
      .catch(onError);

    return () => widget.remove();
  }, [config, onSuccess, onError, pushToHistory]);

  return (
    <div className={styles.authState}>
      {isWidgetLoading && <CircularProgress className={styles.loader} />}
      <div id="auth-center" className={styles.authCenter} ref={widgetRef} />
    </div>
  );
};
