import React, { FC } from 'react';
import { cx } from 'emotion';
import { CircularProgress } from '@mui/material';
import { OverlayProps } from './Overlay.types';
import { styles } from './Overlay.styles';

export const Overlay: FC<OverlayProps> = ({
  children,
  className,
  dataTestId = 'overlay-children',
  isPending,
  size = 20,
}) => (
  <div className={cx(styles.getOverlayWrapper(size), className)} data-testid="overlay-wrapper">
    {isPending ? (
      <>
        <div className={styles.overlay} data-testid="overlay-spinner">
          <CircularProgress size={size} className={styles.spinner} />
        </div>
        <div className={styles.childrenWrapper} data-testid={dataTestId}>
          {children}
        </div>
      </>
    ) : (
      children
    )}
  </div>
);
