import React, { FC, useCallback, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Modal, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useStyles } from 'core';
import { CollapseMap, EntitlementsModalProps } from './EntitlementsModal.types';
import { Messages } from './EntitlementsModal.messages';
import { getStyles } from './EntitlementsModal.styles';
import { Advisor } from '../Advisor/Advisor';

export const EntitlementsModal: FC<EntitlementsModalProps> = ({ entitlements, onClose }) => {
  const styles = useStyles(getStyles);
  const [collapseMap, setCollpaseMap] = useState<CollapseMap>({
    [entitlements[0].number]: true,
  });

  const toggleCollapse = useCallback(
    (key: string) => () => {
      setCollpaseMap((prev) => ({ ...prev, [key]: !collapseMap[key] }));
    },
    [collapseMap, setCollpaseMap],
  );

  return (
    <Modal open title={Messages.title} onClose={onClose}>
      <div className={styles.modal} data-testid="modal-body">
        <Typography component="h6" className={styles.title}>
          {Messages.title}
        </Typography>
        <div className="EntitlementAccordions">
          {entitlements.map(
            ({
              name,
              number,
              summary,
              start_date,
              end_date,
              tier,
              total_units,
              support_level,
              platform: { config_advisor, security_advisor },
            }) => (
              <Accordion
                key={number}
                expanded={collapseMap[number]}
                defaultExpanded
                onChange={toggleCollapse(number)}
                data-testid="entitlement-container"
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <div className={styles.accordionTitle}>
                    <Typography component="h6">{name}</Typography>
                    <Typography component="span" className={styles.expiryDate}>
                      {Messages.expiryDate}: {new Date(end_date).toLocaleDateString()}
                    </Typography>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div className={styles.wrapper} data-testid="entitlements-wrapper">
                    <Typography>
                      <span>{Messages.startDate}:</span>
                      {new Date(start_date).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      <span>{Messages.endDate}:</span>
                      {new Date(end_date).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      <span>{Messages.summary}:</span>
                      {summary}
                    </Typography>
                    <Typography>
                      <span>{Messages.tier}:</span>
                      {tier}
                    </Typography>
                    <Typography>
                      <span>{Messages.totalUnits}:</span>
                      {total_units}
                    </Typography>
                    <Typography>
                      <span>{Messages.supportLevel}:</span>
                      {support_level}
                    </Typography>
                    <Typography>
                      <span>{Messages.platform}</span>
                    </Typography>
                    <div className={styles.advisorsWrapper} data-testid="entitlements-advisors-wrapper">
                      <Advisor label={Messages.configAdvisor} hasAdvisor={config_advisor} />
                      <Advisor label={Messages.securityAdvisor} hasAdvisor={security_advisor} />
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            ),
          )}
        </div>
      </div>
    </Modal>
  );
};
