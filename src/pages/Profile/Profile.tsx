import React, { FC, useCallback, useEffect, useState } from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { TextInputField } from 'components/TextInputField';
import { toast } from 'react-toastify';
import { Box, Button, Link } from '@mui/material';
import { Routes } from 'core/routes';
import { updateProfileAction, getAuth, getProfileAction } from 'store/auth';
import { UpdateProfilePayload } from 'store/types';
import { getPlatformAccessToken, copyToClipboard, validation } from 'core';
import { PrivateLayout } from 'components/Layouts';
import { styles } from './Profile.styles';
import { Messages } from './Profile.messages';
import { CONNECT_PMM_DOC_LINK, FIRSTNAME_LENGTH_MAX, LASTNAME_LENGTH_MAX } from './Profile.constants';

export const ProfilePage: FC = () => {
  const dispatch = useDispatch();
  const { pending, email, firstName, lastName } = useSelector(getAuth);
  const [platformAccessToken, setPlatformAccessToken] = useState('');

  const validationSchema = yup.object({
    firstName: yup.string().label(Messages.firstNameLabel).required().max(FIRSTNAME_LENGTH_MAX),
    lastName: yup.string().label(Messages.lastNameLabel).required().max(LASTNAME_LENGTH_MAX),
  });

  useEffect(() => {
    setPlatformAccessToken(getPlatformAccessToken());
  }, []);

  useEffect(() => {
    if (!email && !pending) {
      dispatch(getProfileAction());
    }
  }, [dispatch, email, pending]);

  const handleUpdateProfileSubmit = useCallback(
    (payload: UpdateProfilePayload) => {
      dispatch(updateProfileAction(payload));
    },
    [dispatch],
  );

  const handleCopyToClipboard = useCallback(async () => {
    await copyToClipboard(platformAccessToken);
    toast.success(Messages.copySuccessful);
  }, [platformAccessToken]);

  return (
    <PrivateLayout>
      <Box component="main" sx={styles.wrapper}>
        <Form
          initialValues={{ email, firstName, lastName, platformAccessToken }}
          onSubmit={handleUpdateProfileSubmit}
          validate={validation(validationSchema)}
        >
          {({ handleSubmit, valid, pristine }: FormRenderProps) => (
            <Box
              component="form"
              name="profile-form"
              data-testid="profile-form"
              onSubmit={handleSubmit}
              sx={styles.form}
            >
              <Box component="legend" sx={styles.legend} data-testid="profile-settings-header">
                {Messages.profile}
              </Box>
              <Box sx={styles.nameFields}>
                <TextInputField
                  name="firstName"
                  label={Messages.firstNameLabel}
                  margin="normal"
                  size="small"
                />
                <TextInputField name="lastName" label={Messages.lastNameLabel} margin="normal" size="small" />
              </Box>
              <TextInputField
                fullWidth
                disabled
                label={Messages.emailLabel}
                name="email"
                margin="normal"
                size="small"
              />
              <Box sx={styles.platformAccessTokenWrapper}>
                <Box component="span" sx={styles.spanWrapper}>
                  {Messages.platformAccessToken}
                </Box>
                <Box>
                  <Link type="link" onClick={handleCopyToClipboard} sx={styles.externalLink}>
                    {Messages.copyToClipboard}
                  </Link>
                </Box>
              </Box>
              <Box sx={styles.linkConnectPMMWrapper}>
                <Box component="span">{Messages.platformAccessTokenDescription}</Box>
                <Link
                  href={CONNECT_PMM_DOC_LINK}
                  target="_blank"
                  data-testid="profile-connect-pmm-doc-link"
                  rel="noreferrer noopener"
                  sx={styles.externalLink}
                >
                  {Messages.platformAccessTokenConnect}
                </Link>
                <Box component="span">.</Box>
              </Box>
              <Box sx={styles.linkEditWrapper}>
                <Link
                  href={Routes.editProfile}
                  target="_blank"
                  data-testid="profile-edit-button"
                  rel="noreferrer noopener"
                  sx={styles.externalLink}
                >
                  {Messages.editProfile}
                </Link>
              </Box>
              <Box sx={styles.buttonWrapper}>
                <Button
                  type="submit"
                  variant="contained"
                  data-qa="profile-submit-button"
                  sx={styles.submitButton}
                  disabled={!valid || pending || pristine}
                >
                  {pending ? Messages.loading : Messages.save}
                </Button>
              </Box>
            </Box>
          )}
        </Form>
      </Box>
    </PrivateLayout>
  );
};
