import React, { FC } from 'react';
import { Tag, useStyles } from '@grafana/ui';
import { cx } from 'emotion';
import { LegendProps } from './Legend.types';
import { getStyles } from './Legend.styles';

export const Legend: FC<LegendProps> = ({ values }) => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.legend} data-testid="legend-wrapper">
      <div className={styles.row}>
        {values.map((item) => (
          <div className={styles.item} key={item.department}>
            <div className={styles.colorNameNumber}>
              <span
                className={styles.color}
                style={{ backgroundColor: item.color }}
                data-testid="department-color"
              />
              <span data-testid="department-name">{item.department}</span>
              <strong data-testid="department-ticket-count">{item.ammount}</strong>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.row}>
        {values.map((item) => (
          <div className={cx(styles.item, styles.alignTop)} key={item.department}>
            <div className={styles.tagList} data-testid="department-tag-list">
              {item.types.map((type) => (
                <Tag name={type} className={styles.tag} key={type} data-testid="department-tags" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
