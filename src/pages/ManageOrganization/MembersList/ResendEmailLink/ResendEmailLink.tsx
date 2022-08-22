import React, { FC } from 'react';
import { Spinner, useStyles } from '@grafana/ui';
import { useCreateResendEmailMutation } from '../MembersList.service';
import { ResendEmailData } from '../MembersList.types';
import { getStyles } from './ResendEmailLink.styles';
import { Messages } from '../MembersList.messages';
import { ResendData } from './ResendEmailLink.types';

export const ResendEmailLink: FC<ResendData> = ({ organization, member }: ResendData) => {
  const styles = useStyles(getStyles);
  const [createResendEmail, { isLoading }] = useCreateResendEmailMutation();

  const handleResend = async (organizationId: string, memberId: string) => {
    await createResendEmail({ organizationId, memberId } as ResendEmailData);
  };

  const resendingEmail = isLoading ? <Spinner /> : Messages.resendEmail;

  return (
    <div className={styles.paragraphWrapper} onClick={() => handleResend(organization, member)}>
      <a className={styles.link}>{resendingEmail}</a>
    </div>
  );
};
