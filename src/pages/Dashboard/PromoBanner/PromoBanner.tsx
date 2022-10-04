import { Overlay } from '@percona/platform-core';
import React from 'react';
import { LinkButton, useStyles } from '@grafana/ui';
import { getStyles } from './PromoBanner.styles';
import { Messages } from './PromoBanner.messages';
import { resourcesLinks } from './PromoBanner.constants';

export const PromoBanner: any = () => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.promoCard} data-testid="promo-section">
      <Overlay className={styles.promoBannerContainer}>
        <p className={styles.cardTitle}>{Messages.pmmAlertingLabel}</p>
        <ul className={styles.list}>
          <li>
            <p>
              {Messages.createAlerts}
              <span className={styles.boldPoint}>{Messages.alertingTemplates}</span>
              {Messages.inPMM}
            </p>
          </li>
          <li>
            <p>
              {Messages.includingTemplates}
              <span className={styles.boldPoint}>{Messages.alertTemplates}</span>
              {Messages.createdByPercona}
            </p>
          </li>
          <li>
            <p>
              {Messages.quicklyIdentify}
              <span className={styles.boldPoint}>{Messages.firedAlerts}</span>
              {Messages.inPMM}
            </p>
          </li>
          <li>
            <p>{Messages.receivingAlerts}</p>
          </li>
        </ul>
        <div className={styles.buttonContainer}>
          <LinkButton
            target="_blank"
            className={styles.contactBtn}
            rel="noreferrer noopener"
            href={resourcesLinks.documentation}
            variant="primary"
            data-testid="promo-link"
          >
            {Messages.seeDocumentation}
          </LinkButton>
        </div>
      </Overlay>
    </div>
  );
};
