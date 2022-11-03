import React, { useCallback, useEffect, useState } from 'react';
import { CheckboxField, LoaderButton, PasswordInputField, TextInputField } from '@percona/platform-core';
import { toast } from 'react-toastify';
import { setIn } from 'final-form';
import { Form } from 'react-final-form';
import * as yup from 'yup';
import Accordion from 'components/Accordion/Accordion';
import { Messages as ToSMessages } from 'components/OktaSignInWidget/TosCheckbox.messages';
import { Messages as LoginMessages } from 'components/OktaSignInWidget/OktaSignInWidget.messages';
import { PRIVACY_PMM_URL, TERMS_OF_SERVICE_URL } from 'core/constants';
import { resourcesLinks } from 'components/SideMenu/SideMenu.constants';
import { cx } from 'emotion';
import { QueryStatus } from '@reduxjs/toolkit/dist/query';
import { useHistory, useLocation } from 'react-router-dom';
import { useActivateProfileMutation } from 'core/api/auth.service';
import { displayAndLogError, oktaAuth, Routes } from 'core';
import { useStyles } from '@grafana/ui';
import { getStyles } from './Activation.styles';
import { Messages } from './Activation.messages';

const Activation = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>();
  const styles = useStyles(getStyles);
  const [activateUser, { status, isLoading, error: activationError }] = useActivateProfileMutation();
  const history = useHistory();
  const { search } = useLocation();

  const query = new URLSearchParams(search);
  const qActivationToken = query.get('token');

  const validationSchema = yup.object({
    password: yup
      .string()
      .label(Messages.createYourAccount.yourPassword)
      .required()
      .min(10)
      .matches(/[a-z]+/, Messages.errors.password.lowerCase)
      .matches(/[A-Z]+/, Messages.errors.password.upperCase)
      .matches(/[0-9]+/, Messages.errors.password.number)
      .test({
        name: 'doesntIncludeNames',
        params: {},
        message: Messages.errors.password.names,
        test: (value, context) => {
          /* does not include first name */
          const firstNameNotIncluded = new RegExp(`^((?!${context.parent.firstName}).)*$`, 'i').test(
            value || '',
          );
          /* does not include last name (case sensite) */
          const lastNameNotIncluded = new RegExp(`^((?!${context.parent.lastName}).)*$`, 'i').test(
            value || '',
          );

          return firstNameNotIncluded && lastNameNotIncluded;
        },
      }),
    repeatPassword: yup
      .string()
      .label(Messages.createYourAccount.verifyYourPassword)
      .required()
      .oneOf([yup.ref('password'), null], Messages.errors.passwordsMustMatch),
    firstName: yup.string().label(Messages.createYourAccount.name).required(),
    lastName: yup.string().label(Messages.createYourAccount.surname).required(),
    tos: yup.boolean().label(Messages.labels.tos).oneOf([true]).required(),
    marketing: yup.boolean().label(Messages.labels.marketing),
  });

  const initialValues = {
    password: '',
    repeatPassword: '',
    firstName: '',
    lastName: '',
    marketing: false,
    tos: false,
  };

  const handleSubmitActivation = useCallback(
    ({ firstName, lastName, tos, marketing, password }: Record<string, any>) => {
      activateUser({
        profile: {
          firstName,
          lastName,
          tos,
          marketing,
        },
        password,
        token: qActivationToken!,
      });
    },
    [activateUser, qActivationToken],
  );

  const validation = useCallback(
    () => async (values: Record<string, any>) => {
      try {
        await validationSchema!.validate(values, { abortEarly: false });
      } catch (e: unknown) {
        if (e instanceof yup.ValidationError) {
          return e.inner.reduce(
            (errors: Object, error: yup.ValidationError) => setIn(errors, error.path!, error.message),
            {},
          );
        }
      }

      return null;
    },
    [validationSchema],
  );

  useEffect(() => {
    if (status === QueryStatus.fulfilled) {
      toast.success(Messages.successfulActivation);
      history.push(Routes.login);
    }

    if (activationError) {
      displayAndLogError(activationError);
    }
  }, [status, activationError, history]);

  useEffect(() => {
    (async () => setIsUserLoggedIn(await oktaAuth.isAuthenticated()))();

    if (isUserLoggedIn) {
      history.push(Routes.dashboard);
    }
  }, [history, isUserLoggedIn]);

  return isUserLoggedIn === false ? (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.h1} data-testid="activation-title">
          {Messages.title}
        </h1>
        <h2 className={styles.h2}>{Messages.subtitle}</h2>
        <Form initialValues={initialValues} validate={validation()} onSubmit={handleSubmitActivation}>
          {({ valid, pristine, handleSubmit }) => (
            <form name="activation-form" data-testid="activation-form">
              <Accordion
                title={Messages.createYourAccount.title}
                description={Messages.createYourAccount.description}
              >
                <div className={styles.content}>
                  <div className={styles.columns}>
                    <span className={styles.firstColumn}>
                      <div className={styles.row}>
                        <TextInputField label={Messages.createYourAccount.name} name="firstName" required />
                        <TextInputField label={Messages.createYourAccount.surname} name="lastName" required />
                      </div>
                      <div className={styles.row}>
                        <PasswordInputField
                          label={Messages.createYourAccount.yourPassword}
                          name="password"
                          required
                        />
                        <PasswordInputField
                          label={Messages.createYourAccount.verifyYourPassword}
                          type="password"
                          name="repeatPassword"
                          required
                        />
                      </div>
                    </span>
                    <span className={styles.minWidth}>
                      <p className={cx(styles.passwordListTitle, styles.infoContainer)}>
                        <span className={styles.infoIcon}>&#9432;</span>
                        {Messages.passwordList.title}
                      </p>
                      <ul className={styles.passwordList}>
                        {Messages.passwordList.rules.map((rule) => (
                          <li key={rule}>{rule}</li>
                        ))}
                      </ul>
                    </span>
                  </div>
                  <CheckboxField
                    label={LoginMessages.marketing}
                    name="marketing"
                    fieldClassName={styles.checkbox}
                  />
                  <CheckboxField
                    label={
                      <>
                        {ToSMessages.iAgree}
                        <a
                          href={TERMS_OF_SERVICE_URL}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.externalLink}
                          data-testid="tos-link"
                        >
                          {LoginMessages.tos}
                        </a>
                        . {ToSMessages.iHaveRead}
                        <a
                          href={PRIVACY_PMM_URL}
                          target="_blank"
                          rel="noreferrer"
                          data-testid="privacy-policy-link"
                          className={styles.externalLink}
                        >
                          {ToSMessages.perconaPrivacyPolicy}
                        </a>
                        .&nbsp;*
                      </>
                    }
                    name="tos"
                    fieldClassName={styles.checkbox}
                    required
                  />
                </div>
              </Accordion>
              <div className={styles.formFooter}>
                <a
                  href={resourcesLinks.help}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={cx(styles.infoContainer, styles.help)}
                >
                  <span className={styles.helpIcon}>?</span>
                  {Messages.help}
                </a>
                <LoaderButton
                  onClick={handleSubmit}
                  data-testid="activate-account-button"
                  loading={isLoading}
                  disabled={!valid || isLoading || pristine}
                >
                  {Messages.activateAccount}
                </LoaderButton>
              </div>
            </form>
          )}
        </Form>
      </div>
    </div>
  ) : null;
};

export default Activation;
