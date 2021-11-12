import React, { FC, useCallback } from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import { useStyles } from '@grafana/ui';
import { LoaderButton, TextInputField, validators } from '@percona/platform-core';
import { Routes } from 'core/routes';
import { MAX_NAME_LENGTH } from 'core/constants';
import { UpdateProfilePayload } from 'store/types';
import { PrivateLayout } from 'components/Layouts';
import { useUserInfo } from 'core/hooks';
import { getStyles } from './Profile.styles';
import { Messages } from './Profile.messages';

const { required, maxLength } = validators;
const nameValidators = [required, maxLength(MAX_NAME_LENGTH)];

export const ProfilePage: FC = () => {
  const styles = useStyles(getStyles);
  const [user, setUser] = useUserInfo();
  const { pending, email, firstName, lastName } = user;

  const handleUpdateProfileSubmit = useCallback(
    (payload: UpdateProfilePayload) => {
      setUser(payload);
    },
    [setUser],
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
                <a href={Routes.editProfile} target="_blank" data-testid="profile-edit-button" className={styles.externalLink} rel="noreferrer">
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

