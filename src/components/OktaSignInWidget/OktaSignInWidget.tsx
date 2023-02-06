import React, { useCallback, useEffect, useRef, useState } from 'react';
// @ts-ignore
import OktaSignIn from '@okta/okta-signin-widget';
import { useStyles } from 'core/utils';
import { getStyles } from 'pages/Login/Login.styles';
import ReactDOM from 'react-dom';
import { PRIVACY_PMM_URL } from 'core/constants';
import { ContextProps, RegistrationData } from './OktaSignInWidget.types';
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

const newRegistrationButton = ({ controller }: ContextProps, widgetRef: HTMLDivElement) => {
  const authContainer = widgetRef.querySelector('.primary-auth-container');
  const registrationContainer = widgetRef.querySelector('.registration-container');

  if (
    registrationContainer?.parentElement === authContainer ||
    !['idp-discovery', 'primary-auth'].includes(controller)
  ) {
    return;
  }

  authContainer?.prepend(registrationContainer!);
};

export const OktaSignInWidget = ({
  config,
  onSuccess,
  onError,
}: {
  config: any;
  onSuccess: any;
  onError: any;
}) => {
  const styles = useStyles(getStyles);
  const widgetRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState('');
  const [email, setEmail] = useState('');

  const showRegisteredEmail = useCallback(
    (widgetRefCurrent: HTMLDivElement) => {
      const descriptionText = widgetRefCurrent.querySelector('.registration-complete .desc');

      if (descriptionText) {
        descriptionText.textContent = Messages.checkYourEmail(email);
      }
    },
    [email],
  );

  const handleAfterRender = useCallback((context: ContextProps) => {
    if (widgetRef.current === null) {
      return;
    }

    setPage(context.controller);

    insertToS(context, widgetRef.current as HTMLDivElement);
    newRegistrationButton(context, widgetRef.current as HTMLDivElement);
  }, []);

  useEffect(() => {
    if (page === 'registration-complete') {
      showRegisteredEmail(widgetRef.current as HTMLDivElement);
    }
  }, [page, email, showRegisteredEmail]);

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

    const widget = new OktaSignIn(config);

    widget.on('afterRender', handleAfterRender);

    widget
      .showSignInToGetTokens({
        el: widgetRef.current,
      })
      .then(onSuccess)
      .catch(onError);

    return () => widget.remove();
  }, [config, onSuccess, onError, handleAfterRender]);

  return <div id="auth-center" className={styles.authCenter} ref={widgetRef} />;
};
