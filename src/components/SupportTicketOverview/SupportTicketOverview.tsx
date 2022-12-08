/* eslint-disable no-magic-numbers */
import React, { FC, useMemo } from 'react';
import { useStyles } from 'core/utils';
import Typography from '@mui/material/Typography';
import { Pie } from 'components/Charts/Pie';
import { getOrgTickets, getOrgTicketsPending } from 'store/orgs';
import { useSelector } from 'react-redux';
import { color, interpolate } from 'd3';
import { IPieItem, PieTypes } from 'components/Charts/Pie/Pie.types';
import { Legend } from './Legend';
import { getStyles } from './SupportTicketOverview.styles';
import { Messages } from './SupportTicketOverview.messages';
import { ICategory } from './SupportTicketOverview.types';
import { DOUGHNUT_WIDTH, PIE_SIZE } from './SupportTicketOverview.constants';

const addIfNotInArray = (arr: string[], item: string) => {
  const isInArray = arr.find((arrItem) => arrItem === item);

  return isInArray ? arr : [...arr, item];
};

const range = interpolate('#e3df00', '#007be0');

export const SupportTicketOverview: FC = () => {
  const tickets = useSelector(getOrgTickets);
  const loading = useSelector(getOrgTicketsPending);
  const styles = useStyles(getStyles);

  const computedItems = useMemo(() => {
    const categories = tickets.reduce((acc: ICategory[], ticket) => {
      const alreadyInAcc = acc.find((category: ICategory) => category.department === ticket.department);

      if (alreadyInAcc) {
        const ammount = alreadyInAcc.ammount + 1;
        const categoriesWithoutFoundOne = acc.filter((category) => category.department !== ticket.department);

        return [
          ...categoriesWithoutFoundOne,
          {
            department: alreadyInAcc.department,
            ammount,
            color: alreadyInAcc.color,
            types: addIfNotInArray(alreadyInAcc.types, ticket.taskType),
          },
        ];
      }

      return [
        ...acc,
        {
          department: ticket.department,
          ammount: 1,
          color: '#fff',
          types: [ticket.taskType],
        },
      ];
    }, []);

    const categoriesWithColors = categories.map((category, index) => {
      /*
        "|| 1" is for a case categories.length - 1
        it might results in 0, which cannot be used to divide the index
      */
      const positionInRange = index / (categories.length - 1 || 1);
      const categoryColor = color(range(positionInRange))?.formatHex() || '#fff';

      return { ...category, color: categoryColor };
    });

    return categoriesWithColors;
  }, [tickets]);

  const pieValues: IPieItem[] = useMemo(
    () =>
      computedItems.map((item) => ({
        name: item.department,
        value: item.ammount,
        color: item.color,
      })),
    [computedItems],
  );

  if (!tickets.length && !loading) {
    return null;
  }

  return (
    <section className={styles.marginSection} data-testid="ticket-overview-section-container">
      <Typography className={styles.headerFont} variant="h6">
        {Messages.header}
      </Typography>
      <div className={styles.container}>
        <div className={styles.containerPadding} data-testid="overview">
          <Legend values={computedItems} />
          <Pie
            values={pieValues}
            size={PIE_SIZE}
            type={PieTypes.DOUGHNUT}
            width={DOUGHNUT_WIDTH}
            centeredElement={
              <div className={styles.centeredElement}>
                <Typography component="strong" data-testid="total-ticket-number">
                  {computedItems.reduce((acc, item) => acc + item.ammount, 0)}
                </Typography>
                <Typography>{Messages.totalTickets}</Typography>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
};
