import React, { useEffect, useRef } from 'react';
// @ts-ignore
import OktaSignIn from '@okta/okta-signin-widget';
import { useStyles } from '@grafana/ui';
import { getStyles } from 'pages/Login/Login.styles';
import ReactDOM from 'react-dom';
import { PRIVACY_PMM_URL, TERMS_OF_SERVICE_URL } from 'core/constants';
import { Messages } from './OktaSignInWidget.messages';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';

interface ContextProps {
  controller: string;
}

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
  let actionText;

  if (controller === 'registration') {
    tosWrapper = getSignUpTosWrapper(widgetRef);
    actionText = Messages.byCreating;
  } else if (['idp-discovery', 'primary-auth'].includes(controller)) {
    tosWrapper = getSocialTosWrapper(widgetRef);
    actionText = Messages.byContinuing;
  }

  if (!tosWrapper) {
    return;
  }

  ReactDOM.render(
    <p className="tos-label" data-testid="tos-label">
      {actionText}
      <a href={TERMS_OF_SERVICE_URL} target="_blank" rel="noreferrer noopener" data-testid="tos-link">
        {Messages.tos}
      </a>
      {Messages.and}
      <a href={PRIVACY_PMM_URL} target="_blank" rel="noreferrer noopener" data-testid="privacy-policy-link">
        {Messages.privacyPolicy}
      </a>
      .
    </p>,
    tosWrapper,
  );
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

  useEffect(() => {
    if (!widgetRef.current) {
      return () => {};
    }

    const widget = new OktaSignIn(config);

    widget.on('afterRender', (context: ContextProps) =>
      insertToS(context, widgetRef.current as HTMLDivElement),
    );

    widget
      .showSignInToGetTokens({
        el: widgetRef.current,
      })
      .then(onSuccess)
      .catch(onError);

    return () => widget.remove();
  }, [config, onSuccess, onError]);

  return <div id="auth-center" className={styles.authCenter} ref={widgetRef} />;
};
