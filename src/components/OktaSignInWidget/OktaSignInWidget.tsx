import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
// @ts-ignore
import OktaSignIn from '@okta/okta-signin-widget';
import { useStyles } from '@grafana/ui';
import { getStyles } from 'pages/Login/Login.styles';
import ReactDOM from 'react-dom';
import { PRIVACY_PMM_URL, TERMS_OF_SERVICE_URL } from 'core/constants';
import { cx } from 'emotion';
import { ContextProps, ToSCheckboxProps } from './OktaSignInWidget.types';
import { Messages } from './OktaSignInWidget.messages';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';

const disabledCls = 'link-button-disabled';

const ToSCheckbox: FC<ToSCheckboxProps> = ({ submitBtn }) => {
  const [marketingChecked, setMarketingChecked] = useState(false);
  const [tosChecked, setTosChecked] = useState(false);

  const handleMarketingCheck = useCallback(
    ({ target: { checked: eChecked } }: React.ChangeEvent<HTMLInputElement>) => {
      setMarketingChecked(eChecked);
    },
    [],
  );

  const handleTosCheck = useCallback(
    ({ target: { checked: eChecked } }: React.ChangeEvent<HTMLInputElement>) => {
      setTosChecked(eChecked);

      if (eChecked) {
        submitBtn.classList.remove(disabledCls);
        submitBtn.removeAttribute('disabled');
      } else {
        submitBtn.classList.add(disabledCls);
        submitBtn.setAttribute('disabled', 'true');
      }
    },
    [submitBtn],
  );

  useEffect(() => {
    submitBtn.classList.add(disabledCls);
    submitBtn.setAttribute('disabled', 'true');
  }, [submitBtn]);

  return (
    <div data-se="o-form-fieldset" className="o-form-fieldset o-form-label-top">
      <div data-se="o-form-input-container" className="o-form-input">
        <span data-se="o-form-input-marketing" className="o-form-input-name-marketing">
          <div className="custom-checkbox">
            <input
              type="checkbox"
              name="marketing"
              id="input098"
              checked={marketingChecked}
              onChange={handleMarketingCheck}
              value={marketingChecked ? 'on' : 'off'}
            />
            <label
              htmlFor="input098"
              data-se-for-name="marketing"
              data-testid="marketing-label"
              className={cx('marketing-label', { checked: marketingChecked })}
            >
              {Messages.marketing}
            </label>
          </div>
        </span>
        <span data-se="o-form-input-tos" className="o-form-input-name-tos">
          <div className="custom-checkbox">
            <input
              type="checkbox"
              name="tos"
              id="input099"
              checked={tosChecked}
              onChange={handleTosCheck}
              value={tosChecked ? 'on' : 'off'}
            />
            <label
              htmlFor="input099"
              data-se-for-name="tos"
              data-testid="tos-label"
              className={cx('tos-label', { checked: tosChecked })}
            >
              {Messages.iAgree}
              <a href={TERMS_OF_SERVICE_URL} target="_blank" rel="noreferrer" data-testid="tos-link">
                {Messages.tos}
              </a>
              . {Messages.iHaveRead}
              <a href={PRIVACY_PMM_URL} target="_blank" rel="noreferrer" data-testid="privacy-policy-link">
                {Messages.perconaPrivacyPolicy}
              </a>
              .&nbsp;*
            </label>
          </div>
        </span>
      </div>
    </div>
  );
};

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
        {Messages.byRegistering}
        <a href={TERMS_OF_SERVICE_URL} target="_blank" rel="noreferrer noopener" data-testid="tos-link">
          {Messages.tos}
        </a>
        {Messages.andPerconas}
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

const handleAfterRender = (context: ContextProps, widgetRef: HTMLDivElement) => {
  insertToS(context, widgetRef);
  newRegistrationButton(context, widgetRef);
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

    config.features.registration = true;
    config.registration = {
      preSubmit: (postData: any, onSuccessSignUp: (postData: any) => {}) => {
        postData.tos = true;
        const marketingConsent = widgetRef.current?.querySelector('[name=marketing]') as HTMLInputElement;

        postData.marketing = marketingConsent.checked;
        onSuccessSignUp(postData);
      },
    };

    const widget = new OktaSignIn(config);

    widget.on('afterRender', (context: ContextProps) =>
      handleAfterRender(context, widgetRef.current as HTMLDivElement),
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
