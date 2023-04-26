import React, { FC } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { useStyles } from 'core/utils';
import { ExpandMore } from '@mui/icons-material';
import { TabPanelProps } from './TabPanel.types';
import { getStyles } from './Tabpanel.styles';
import { AdvisorsTable } from '../AdvisorsTable';

export const TabPanel: FC<TabPanelProps> = ({ advisors }) => {
  const styles = useStyles(getStyles);

  return (
    <>
      <div className={styles.tableWrapper} data-testid="advisors-list-wrapper">
        {advisors &&
          advisors.map((advisor: any) => (
            <div className={styles.tableWrapper} data-testid="advisors-acoordian-wrapper" key={advisor.name}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={styles.accordianSummary}>{advisor.summary}</Typography>
                  <Typography className={styles.accordianDescription}>{advisor.description}</Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <AdvisorsTable advisors={advisor.checks} />
                </AccordionDetails>
              </Accordion>
            </div>
          ))}
      </div>
    </>
  );
};
