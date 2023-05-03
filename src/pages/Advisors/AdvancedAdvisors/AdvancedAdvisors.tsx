import React, { FC, useState } from 'react';
import {
  Button,
  IconButton,
  Card,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { useStyles } from 'core';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Messages } from './AdvancedAdvisors.messages';
import { getStyles } from './AdvancedAdvisors.styles';
import { ShowAdvancedAdvisorsProps } from './AdvancedAdvisors.types';
import { AdvisorsTable } from '../AdvisorsTable';
import { PERCONA_SUBSCRIPTIONS } from './AdvancedAdvisors.constants';

export const AdvancedAdvisors: FC<ShowAdvancedAdvisorsProps> = ({ advisors }) => {
  const [isVisible, setIsVisible] = useState(false);
  const styles = useStyles(getStyles);

  const onClose = () => {
    setIsVisible(false);
  };

  const onOpen = () => {
    setIsVisible(true);
  };

  return (
    <div className={styles.advisorsWrapper}>
      {isVisible ? (
        <Card elevation={3} className={styles.advisorsContent} data-testid="advanced-advisors-details">
          <div className={styles.advisorsHeader}>
            <div className={styles.title}>{Messages.title}</div>
            <div className={styles.closeBtn}>
              <IconButton aria-label="delete" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          {advisors?.map((advisor) => (
            <Accordion className={styles.advisor}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ width: '33%', flexShrink: 0 }}>{advisor.summary}</Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    width: '60%',
                  }}
                >
                  {advisor.description}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <AdvisorsTable advisors={advisor.checks} />
              </AccordionDetails>
            </Accordion>
          ))}
          <Button
            target="_blank"
            rel="noreferrer noopener"
            className={styles.contactSalesBtn}
            variant="contained"
            href={PERCONA_SUBSCRIPTIONS}
            data-testid="contact-sales"
          >
            {Messages.contactSalesBtn}
          </Button>
        </Card>
      ) : (
        <Button variant="contained" onClick={onOpen} data-testid="show-advanced-advisors-btn">
          {Messages.viewAdvancedAdvisorsBtn}
        </Button>
      )}
    </div>
  );
};
