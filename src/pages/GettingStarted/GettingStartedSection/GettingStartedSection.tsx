import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { cx } from 'emotion';
import { Button, useStyles } from '@grafana/ui';
import doneIcon from 'assets/tick-circle.svg';
import incompleteIcon from 'assets/circle-filled.svg';
import { getStyles } from './GettingStartedSection.styles';
import { Messages } from './GettingStartedSection.messages';
import { GettingStartedSectionProps } from './GettingStartedSection.types';

export const GettingStartedSection: FC<GettingStartedSectionProps> = ({
  description,
  linkIcon,
  linkText,
  linkTo,
  title,
  disabled = false,
  isTicked = false,
  loading = false,
  loadingMessage = Messages.loading,
}) => {
  const styles = useStyles(getStyles);
  const tickClassName = cx(styles.tickImage, { [styles.showTick]: isTicked });
  const hideTickBg = cx({ [styles.hideTickBg]: isTicked });

  return (
    <section data-testid="getting-started-section" className={styles.section}>
      <header data-testid="getting-started-section-header" className={styles.header}>
        <img className={tickClassName} alt={Messages.done} src={doneIcon} />
        <img className={hideTickBg} alt={Messages.incomplete} src={incompleteIcon} />
        <h2>{title}</h2>
      </header>
      <div data-testid="getting-started-section-description-wrapper" className={styles.descriptionWrapper}>
        <span data-testid="getting-started-section-description" className={styles.description}>{description}</span>
        {loading ? (
          <span
            data-testid="getting-started-section-loading"
            className={styles.loadingMessage}>
              {loadingMessage}
          </span>
        ) : (
          <Link to={linkTo} className={styles.link}>
            <Button data-testid="getting-started-section-link" icon={linkIcon} variant="link" disabled={disabled}>
              {linkText}
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
};
