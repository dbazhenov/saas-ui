import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  legend: css`
    display: flex;
    flex: 1;
    padding-right: ${spacing.lg};
    flex-direction: column;
  `,
  row: css`
    display: flex;
    flex: 1;
  `,
  item: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    padding-right: ${spacing.md};
  `,
  alignTop: css`
    justify-content: flex-start;
  `,
  colorNameNumber: css`
    display: flex;
    align-items: center;

    strong {
      margin-left: ${spacing.lg};
    }
  `,
  color: css`
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 8px;
    margin-right: 8px;
  `,
  tagList: css`
    display: flex;
    flex-wrap: wrap;
  `,
  tag: css`
    background-color: #aad2fa1f;
    border: 1px solid #aad2fa99;
    border-radius: 20px;
    color: #2f8ae4;
    padding: ${spacing.xs} ${spacing.sm};
    margin-top: ${spacing.sm};
    margin-right: ${spacing.xs};
  `,
});
