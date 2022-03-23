import React, { FC, useCallback, useEffect } from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles } from '@grafana/ui';
import { LoaderButton, TextInputField, validators } from '@percona/platform-core';
import { Routes } from 'core/routes';
import { MAX_NAME_LENGTH } from 'core/constants';
import { updateProfileAction, getAuth, getProfileAction } from 'store/auth';
import { UpdateProfilePayload } from 'store/types';
import { PrivateLayout } from 'components/Layouts';
import { getStyles } from './Profile.styles';
import { Messages } from './Profile.messages';

const { required, maxLength } = validators;
const nameValidators = [required, maxLength(MAX_NAME_LENGTH)];

export const ProfilePage: FC = () => {
  const styles = useStyles(getStyles);
  const dispatch = useDispatch();
  const { pending, email, firstName, lastName } = useSelector(getAuth);

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

  return (
    <PrivateLayout>
      <main className={styles.wrapper}>
        <Form initialValues={{ email, firstName, lastName }} onSubmit={handleUpdateProfileSubmit}>
          {({ handleSubmit, valid, pristine }: FormRenderProps) => (
            <form name="profile-form" data-testid="profile-form" className={styles.form} onSubmit={handleSubmit}>
              <legend className={styles.legend}>{Messages.profile}</legend>
              <div className={styles.nameFields}>
                <TextInputField
                  disabled={pending}
                  label={Messages.firstNameLabel}
                  name="firstName"
                  parse={(value) => value.trim()}
                  validators={nameValidators}
                />
                <TextInputField
                  disabled={pending}
                  label={Messages.lastNameLabel}
                  name="lastName"
                  parse={(value) => value.trim()}
                  validators={nameValidators}
                />
              </div>
              <div className={styles.emailFieldWrapper}>
                <TextInputField disabled label={Messages.emailLabel} name="email" />
                <a href={Routes.editProfile} target="_blank" data-testid="profile-edit-button" className={styles.externalLink} rel="noreferrer noopener">
                  {Messages.editProfile}
                </a>
              </div>
              <div className={styles.buttonWrapper}>
                <LoaderButton data-qa="profile-submit-button" type="submit" disabled={!valid || pending || pristine}>
                  {pending ? Messages.loading : Messages.save}
                </LoaderButton>
              </div>
            </form>
          )}
        </Form>
      </main>
    </PrivateLayout>
  );
};

