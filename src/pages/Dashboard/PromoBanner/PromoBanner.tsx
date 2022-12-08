import React from 'react';
import { useStyles } from 'core';
import { Button, List, Typography } from '@mui/material';
import { getStyles } from './PromoBanner.styles';
import { Messages } from './PromoBanner.messages';
import { resourcesLinks } from './PromoBanner.constants';

export const PromoBanner: any = () => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.promoCard} data-testid="promo-section">
      <div className={styles.promoBannerContainer}>
        <Typography className={styles.cardTitle}>{Messages.pmmAlertingLabel}</Typography>
        <List className={styles.list}>
          <li>
            <Typography>
              {Messages.createAlerts}
              <span className={styles.boldPoint}>{Messages.alertingTemplates}</span>
              {Messages.inPMM}
            </Typography>
          </li>
          <li>
            <Typography>
              {Messages.includingTemplates}
              <span className={styles.boldPoint}>{Messages.alertTemplates}</span>
              {Messages.createdByPercona}
            </Typography>
          </li>
          <li>
            <Typography>
              {Messages.quicklyIdentify}
              <span className={styles.boldPoint}>{Messages.firedAlerts}</span>
              {Messages.inPMM}
            </Typography>
          </li>
          <li>
            <Typography>{Messages.receivingAlerts}</Typography>
          </li>
        </List>
        <div className={styles.buttonContainer}>
          <Button
            target="_blank"
            className={styles.contactBtn}
            rel="noreferrer noopener"
            href={resourcesLinks.documentation}
            variant="contained"
            data-testid="promo-link"
          >
            {Messages.seeDocumentation}
          </Button>
        </div>
      </div>
    </div>
  );
};
