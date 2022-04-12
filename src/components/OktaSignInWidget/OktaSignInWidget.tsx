import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
// @ts-ignore
import OktaSignIn from '@okta/okta-signin-widget';
import { useStyles } from '@grafana/ui';
import { getStyles } from 'pages/Login/Login.styles';
import { cx } from 'emotion';
import ReactDOM from 'react-dom';
import { PRIVACY_PMM_URL, TERMS_OF_SERVICE_URL } from 'core/constants';
import { Messages } from './OktaSignInWidget.messages';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';

const disabledCls = 'link-button-disabled';

interface ToSCheckboxProps {
  submitBtn: HTMLInputElement;
}

const ToSCheckbox: FC<ToSCheckboxProps> = ({ submitBtn }) => {
  const [checked, setChecked] = useState(false);

  const handleCheck = useCallback(
    ({ target: { checked: eChecked } }: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(eChecked);

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
        <span data-se="o-form-input-tos" className="o-form-input-name-tos">
          <div className="custom-checkbox">
            <input
              type="checkbox"
              name="tos"
              id="input099"
              checked={checked}
              onChange={handleCheck}
              value={checked ? 'on' : 'off'}
            />
            <label htmlFor="input099" data-se-for-name="tos" className={cx('tos-label', { checked })}>
              {Messages.iHaveAgreed}
              <a href={TERMS_OF_SERVICE_URL} target="_blank" rel="noreferrer">
                {Messages.tos}
              </a>
              {Messages.and}
              <a href={PRIVACY_PMM_URL} target="_blank" rel="noreferrer">
                {Messages.privacyPolicy}
              </a>
              &nbsp;*
            </label>
          </div>
        </span>
      </div>
    </div>
  );
};

interface ContextProps {
  controller: string;
}

const insertToS = ({ controller }: ContextProps, widgetRef: HTMLDivElement) => {
  if (controller !== 'registration' || widgetRef.querySelector('.tos-label')) {
    return;
  }

  const fieldset = widgetRef.querySelector('.o-form-fieldset-container');
  const requiredLabel = widgetRef.querySelector('.required-fields-label');

  if (!fieldset || !requiredLabel) {
    return;
  }

  const container = requiredLabel.parentNode;

  if (!container) {
    return;
  }

  const submit = widgetRef.querySelector('.button-primary') as HTMLInputElement;
  const tosWrapper = document.createElement('div');

  tosWrapper.id = 'tos-wrapper';

  container.insertBefore(tosWrapper, requiredLabel);
  ReactDOM.render(<ToSCheckbox submitBtn={submit} />, tosWrapper);
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
