import React, { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { cx } from 'emotion';
import { Link, Button, Typography } from '@mui/material';
import { useStyles } from 'core/utils';
import doneIcon from 'assets/tick-circle.svg';
import incompleteIcon from 'assets/circle-filled.svg';
import { getStyles } from './GettingStartedSection.styles';
import { Messages } from './GettingStartedSection.messages';
import { GettingStartedSectionProps } from './GettingStartedSection.types';

export const GettingStartedSection: FC<GettingStartedSectionProps> = ({
  description,
  linkIcon,
  linkIsExternal,
  linkText,
  linkTo,
  title,
  disabled = false,
  isTicked = false,
  loading = false,
  loadingMessage = Messages.loading,
  readMoreLink = null,
}) => {
  const styles = useStyles(getStyles);
  const tickClassName = cx(styles.tickImage, { [styles.showTick]: isTicked });
  const hideTickBg = cx({ [styles.hideTickBg]: isTicked });

  const LinkButton = () => (
    <Button data-testid="getting-started-section-link-button" startIcon={linkIcon} disabled={disabled}>
      {linkText}
    </Button>
  );

  const SectionLink = () =>
    linkIsExternal ? (
      <Link
        href={linkTo}
        data-testid="getting-started-section-link"
        className={cx(styles.link, disabled ? styles.linkDisabled : undefined)}
        target="_blank"
        rel="noreferrer noopener"
      >
        <LinkButton />
      </Link>
    ) : (
      <RouterLink
        to={linkTo}
        data-testid="getting-started-section-link"
        className={cx(styles.link, disabled ? styles.linkDisabled : undefined)}
      >
        <LinkButton />
      </RouterLink>
    );

  return (
    <section data-testid="getting-started-section" className={styles.section}>
      <header data-testid="getting-started-section-header" className={styles.header}>
        <img
          className={tickClassName}
          alt={Messages.done}
          src={doneIcon}
          data-testid="getting-started-done-icon"
        />
        <img
          className={hideTickBg}
          alt={Messages.incomplete}
          src={incompleteIcon}
          data-testid="getting-started-incomplete-icon"
        />
        <Typography variant="h5" className={styles.title}>
          {title}
        </Typography>
      </header>
      <div data-testid="getting-started-section-description-wrapper" className={styles.descriptionWrapper}>
        <span data-testid="getting-started-section-description" className={styles.description}>
          {description}
          {readMoreLink && (
            <>
              {' '}
              <Link
                href={readMoreLink}
                target="_blank"
                rel="noreferrer"
                className={styles.readMoreLink}
                data-testid="read-more-link"
              >
                <Button data-testid="getting-started-section-link-button">{Messages.readMore}</Button>
              </Link>
            </>
          )}
        </span>
        {loading ? (
          <span data-testid="getting-started-section-loading" className={styles.loadingMessage}>
            {loadingMessage}
          </span>
        ) : (
          <SectionLink />
        )}
      </div>
    </section>
  );
};
