import React, { FC, useState, useCallback } from 'react';
import { Collapse, useStyles } from '@grafana/ui';
import { Modal } from '@percona/platform-core';
import { CollapseMap, EntitlementsModalProps } from './EntitlementsModal.types';
import { Messages } from './EntitlementsModal.messages';
import { getStyles } from './EntitlementsModal.styles';
import { Advisor } from '../Advisor/Advisor';

export const EntitlementsModal: FC<EntitlementsModalProps> = ({ entitlements, onClose }) => {
  const styles = useStyles(getStyles);
  const [collapseMap, setCollpaseMap] = useState<CollapseMap>({
    [entitlements[0].number]: true,
  });
  const toggleCollapse = useCallback((key: string) => () => {
    setCollpaseMap({ ...collapseMap, [key]: !collapseMap[key] });
  }, [collapseMap, setCollpaseMap]);

  return (
    <div className={styles.modalWrapper(entitlements)}>
      <Modal isVisible title={Messages.title} onClose={onClose}>
        {entitlements.map(({
          name,
          number,
          summary,
          start_date,
          end_date,
          tier,
          total_units,
          support_level,
          platform: {
            config_advisor,
            security_advisor,
          },
        }) => (
          <Collapse
            key={number}
            collapsible
            label={name}
            isOpen={collapseMap[number]}
            onToggle={toggleCollapse(number)}
          >
            <>
              <div className={styles.wrapper} data-testid="entitlements-wrapper">
                <p><span>{Messages.startDate}:</span>{new Date(start_date).toLocaleDateString()}</p>
                <p><span>{Messages.endDate}:</span>{new Date(end_date).toLocaleDateString()}</p>
                <p><span>{Messages.summary}:</span>{summary}</p>
                <p><span>{Messages.tier}:</span>{tier}</p>
                <p><span>{Messages.totalUnits}:</span>{total_units}</p>
                <p><span>{Messages.supportLevel}:</span>{support_level}</p>
                <p><span>{Messages.platform}</span></p>
                <div className={styles.advisorsWrapper} data-testid="entitlements-advisors-wrapper">
                  <Advisor label={Messages.configAdvisor} hasAdvisor={config_advisor} />
                  <Advisor label={Messages.securityAdvisor} hasAdvisor={security_advisor} />
                </div>
              </div>
            </>
          </Collapse>
        ))}
      </Modal>
    </div>
  );
};
