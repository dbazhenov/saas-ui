/* eslint-disable no-magic-numbers */
import React, { FC, useMemo } from 'react';
import { arc, pie as d3pie } from 'd3';
import { useStyles } from '@grafana/ui';
import { getStyles } from './Pie.styles';
import { IPieItem, IPie } from './Pie.types';

export const Pie: FC<IPie> = ({ values, size, width = 0, centeredElement }) => {
  const styles = useStyles(getStyles);

  const pie = useMemo(() => {
    const pieGenerator = d3pie<any, IPieItem>().value((d) => d.value);

    return pieGenerator(values);
  }, [values]);

  const arcs = useMemo(() => {
    const arcPathGenerator = arc();
    const innerRadius = width ? (size - width) / 2 : 0;
    const outerRadius = size / 2;

    return pie.map((p) =>
      arcPathGenerator({
        innerRadius,
        outerRadius,
        startAngle: p.startAngle,
        endAngle: p.endAngle,
      }),
    );
  }, [pie, size, width]);

  return (
    <div className={styles.wrapper}>
      <svg width={size} height={size}>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          {arcs.map((currentArc, i) => (
            <path
              key={values[i].name}
              d={currentArc ?? undefined}
              fill={values[i].color}
              strokeWidth={2}
              className={styles.path}
            />
          ))}
        </g>
      </svg>
      <div className={styles.centeredElement}>{centeredElement}</div>
    </div>
  );
};
