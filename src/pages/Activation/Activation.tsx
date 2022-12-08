import React, { useCallback, useEffect, useState } from 'react';
import { ActivationContentLoader } from 'components/ContentLoader/ActivationContentLoader/ActivationContentLoader';
import {
  Alert,
  AlertTitle,
  Accordion,
  AccordionDetails,
  Button,
  Divider,
  Link,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Checkboxes, TextField } from 'mui-rff';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { toast } from 'react-toastify';
import { Form } from 'react-final-form';
import * as yup from 'yup';
import { PRIVACY_PMM_URL, TERMS_OF_SERVICE_URL } from 'core/constants';
import { resourcesLinks } from 'components/SideMenu/SideMenu.constants';
import { cx } from 'emotion';
import { QueryStatus } from '@reduxjs/toolkit/dist/query';
import { useHistory, useLocation } from 'react-router-dom';
import { useActivateProfileMutation, useValidateTokenMutation } from 'core/api/auth.service';
import { displayAndLogError, oktaAuth, Routes } from 'core';
import { useStyles, validation } from 'core/utils';
import { Messages as LoginMessages } from 'components/OktaSignInWidget/OktaSignInWidget.messages';
import { Messages as ToSCheckboxMessages } from 'components/OktaSignInWidget/TosCheckbox.messages';
import { getStyles } from './Activation.styles';
import { Messages } from './Activation.messages';
import { FIVE_MINUTES } from './Activation.constants';

const Activation = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>();
  const [isTokenInvalid, setIsTokenInvalid] = useState<boolean>(false);
  const styles = useStyles(getStyles);
  const [
    validateToken,
    {
      data: validateTokenResponseData,
      status: validateTokenStatus,
      isLoading: isTokenValidationLoading,
      error: tokenValidationError,
    },
  ] = useValidateTokenMutation();
  const [activateUser, { status, isLoading, error: activationError }] = useActivateProfileMutation();
  const history = useHistory();
  const { search } = useLocation();

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

  useEffect(() => {
    const query = new URLSearchParams(search);
    const qActivationToken = query.get('token');

    if (!qActivationToken) {
      setIsTokenInvalid(true);

      return;
    }

    validateToken({ activation_token: qActivationToken });
  }, [search, validateToken]);

  useEffect(() => {
    if (validateTokenResponseData) {
      const timer = setTimeout(() => {
        setIsTokenInvalid(true);
      }, FIVE_MINUTES);

      return () => clearTimeout(timer);
    }

    return () => {};
  }, [validateTokenResponseData]);

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
        token: validateTokenResponseData?.state_token!,
      });
    },
    [activateUser, validateTokenResponseData?.state_token],
  );

  useEffect(() => {
    if (tokenValidationError) {
      setIsTokenInvalid(true);
    }
  }, [history, tokenValidationError]);

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
  }, [history, isUserLoggedIn]);

  if (isUserLoggedIn) {
    history.push(Routes.root);
  }

  if (isTokenValidationLoading || validateTokenStatus === QueryStatus.uninitialized) {
    return <ActivationContentLoader />;
  }

  if (isTokenInvalid) {
    return (
      <div className={styles.wrapperInvalid}>
        <div className={styles.containerInvalid}>
          <Alert severity="error">
            <AlertTitle>{Messages.tokenExpired.title}</AlertTitle>
            {Messages.tokenExpired.description}
          </Alert>
          <div className={styles.center}>
            <Button variant="contained" onClick={() => history.push(Routes.root)} className={styles.goToHome}>
              {Messages.goToHome}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const TosLabel = (
    <>
      {ToSCheckboxMessages.iAgree}
      <Link
        href={TERMS_OF_SERVICE_URL}
        target="_blank"
        rel="noreferrer"
        className={styles.externalLink}
        data-testid="tos-link"
      >
        {LoginMessages.tos}
      </Link>
      . {ToSCheckboxMessages.iHaveRead}
      <Link
        href={PRIVACY_PMM_URL}
        target="_blank"
        rel="noreferrer"
        data-testid="privacy-policy-link"
        className={styles.externalLink}
      >
        {ToSCheckboxMessages.perconaPrivacyPolicy}
      </Link>
    </>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Typography variant="h4" component="h1" className={styles.h1} data-testid="activation-title">
          {Messages.title}
        </Typography>
        <Typography variant="h5" component="h2" className={styles.h2}>
          {Messages.subtitle}
        </Typography>
        <Form
          initialValues={initialValues}
          validate={validation(validationSchema)}
          onSubmit={handleSubmitActivation}
        >
          {({ valid, pristine, handleSubmit }) => (
            <form name="activation-form" data-testid="activation-form">
              <Accordion defaultExpanded expanded className={styles.flexColumn}>
                <AccordionDetails>
                  <div className={styles.flexColumn}>
                    <Typography variant="h3" component="h3" className={styles.title}>
                      {Messages.createYourAccount.title}
                    </Typography>
                    <Divider />
                    <Typography className={styles.description}>
                      {Messages.createYourAccount.description}
                    </Typography>
                  </div>
                  <div className={styles.content}>
                    <div className={styles.columns}>
                      <span className={styles.firstColumn}>
                        <div className={styles.row}>
                          <TextField
                            label={Messages.createYourAccount.name}
                            name="firstName"
                            inputProps={{ 'data-testid': 'firstName-text-input' }}
                            required
                          />
                          <TextField
                            label={Messages.createYourAccount.surname}
                            name="lastName"
                            inputProps={{ 'data-testid': 'lastName-text-input' }}
                            required
                          />
                        </div>
                        <div className={styles.row}>
                          <TextField
                            label={Messages.createYourAccount.yourPassword}
                            type="password"
                            name="password"
                            inputProps={{ 'data-testid': 'password-password-input' }}
                            required
                          />
                          <TextField
                            label={Messages.createYourAccount.verifyYourPassword}
                            type="password"
                            name="repeatPassword"
                            inputProps={{ 'data-testid': 'repeatPassword-password-input' }}
                            required
                          />
                        </div>
                      </span>
                      <span className={styles.minWidth}>
                        <Typography
                          variant="body2"
                          className={cx(styles.passwordListTitle, styles.infoContainer)}
                        >
                          <InfoOutlinedIcon fontSize="small" />
                          {Messages.passwordList.title}
                        </Typography>
                        <ul className={styles.passwordList}>
                          {Messages.passwordList.rules.map((rule) => (
                            <li key={rule}>
                              <Typography variant="body2">{rule}</Typography>
                            </li>
                          ))}
                        </ul>
                      </span>
                    </div>
                    <Checkboxes
                      name="marketing"
                      data={{ label: LoginMessages.marketing, value: true }}
                      data-testid="marketing-checkbox-input"
                      required
                    />
                    <Checkboxes
                      name="tos"
                      data={{ label: TosLabel, value: true }}
                      showError={() => false}
                      data-testid="tos-checkbox-input"
                      required
                    />
                  </div>
                </AccordionDetails>
              </Accordion>
              <div className={styles.formFooter}>
                <Link
                  href={resourcesLinks.help}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={styles.infoContainer}
                >
                  <HelpOutlineOutlinedIcon fontSize="small" />
                  {Messages.help}
                </Link>
                <LoadingButton
                  onClick={handleSubmit}
                  variant="contained"
                  data-testid="activate-account-button"
                  loading={isLoading}
                  disabled={!valid || isLoading || pristine}
                >
                  {Messages.activateAccount}
                </LoadingButton>
              </div>
            </form>
          )}
        </Form>
      </div>
    </div>
  );
};

export default Activation;
