import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { AccordionProps } from './Accordion.types';
import { getStyles } from './Accordion.styles';

const Accordion: FC<AccordionProps> = ({ title, description, children }) => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div className={styles.content}>
        {description && <div className={styles.description}>{description}</div>}
        {children}
      </div>
    </div>
  );
};

export default Accordion;
