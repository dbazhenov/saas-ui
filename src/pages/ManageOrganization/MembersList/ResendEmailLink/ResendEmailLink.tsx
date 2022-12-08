import React, { FC } from 'react';
import { CircularProgress, Link } from '@mui/material';
import { useStyles } from 'core/utils';
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

  return (
    <div
      className={styles.paragraphWrapper}
      onClick={() => handleResend(organization, member)}
      data-testid="resend-email-link"
    >
      {isLoading ? (
        <CircularProgress className={styles.loader} />
      ) : (
        <Link className={styles.link}>{Messages.resendEmail}</Link>
      )}
    </div>
  );
};
