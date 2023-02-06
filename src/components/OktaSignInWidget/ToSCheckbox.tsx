import { PRIVACY_PMM_URL, TERMS_OF_SERVICE_URL } from 'core/constants';
import { cx } from 'emotion';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useStyles } from 'core/utils';
import { Messages } from './TosCheckbox.messages';
import { Messages as WidgetMessages } from './OktaSignInWidget.messages';
import { ToSCheckboxProps } from './ToSCheckbox.types';
import { getStyles } from './ToSCheckbox.styles';

const disabledCls = 'link-button-disabled';

export const ToSCheckbox: FC<ToSCheckboxProps> = ({ submitBtn }) => {
  const [tosChecked, setTosChecked] = useState(false);
  const styles = useStyles(getStyles);

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
          <p className={styles.marketingLabel} data-testid="marketing-label">
            {Messages.marketing}
            <a
              className={styles.tosLink}
              href={PRIVACY_PMM_URL}
              target="_blank"
              rel="noreferrer noopener"
              data-testid="privacy-policy-link"
            >
              {Messages.privacyPolicy}
            </a>
          </p>
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
                {WidgetMessages.tos}
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
