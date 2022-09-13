import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

export const getStyles = ({ colors, spacing, typography, palette }: GrafanaTheme) => ({
  wrapper: css`
    display: flex;
    flex: 1;
    justify-content: center;
    background-color: ${colors.bg2};
    height: 100%;
    min-height: 100vh;
    padding: ${spacing.lg};
  `,
  container: css`
    flex: 1;
    max-width: 1100px;
    margin-top: 70px;
  `,
  h1: css`
    padding: 0;
    margin: 0;
    font-size: 32px;
    color: ${colors.textHeading};
  `,
  h2: css`
    padding: 0;
    margin: 0;
    margin-top: -4px;
    margin-bottom: 35px;
    font-weight: ${typography.weight.light};
    font-size: 32px;
    color: ${colors.text};
  `,
  content: css`
    padding: ${spacing.lg};
    background-color: ${colors.bg2};

    input {
      max-width: 300px;
    }
  `,
  columns: css`
    display: flex;
    margin-bottom: ${spacing.md};
    gap: ${spacing.lg};
  `,
  firstColumn: css`
    flex: 1;
    max-width: ${600 + spacing.lg};
  `,
  minWidth: css`
    width: fit-content;
    flex: unset !important;
  `,
  row: css`
    display: flex;
    flex: 1;
    gap: ${spacing.lg};
    & > * {
      flex: 1;
      max-width: 300px;
    }
  `,
  infoContainer: css`
    display: flex;
    align-items: center;
    gap: 5px;
  `,
  passwordListTitle: css`
    line-height: 20px;
    font-size: ${typography.size.sm};
    font-weight: ${typography.weight.semibold};
    color: ${colors.formLabel};
    margin: 0;
  `,
  infoIcon: css`
    font-size: ${typography.size.lg};
    font-weight: ${typography.weight.bold};
    cursor: default;
    user-select: none;
  `,
  passwordList: css`
    margin-left: ${spacing.lg};
    line-height: 18px;
    font-size: ${typography.size.sm};
    color: ${colors.formLabel};
  `,
  checkbox: css`
    max-width: 650px;
    margin-bottom: 5px !important;

    & > div {
      display: none;
    }
  `,
  externalLink: css`
    color: ${colors.linkExternal};
  `,
  formFooter: css`
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
  `,
  help: css`
    color: ${colors.linkExternal};
    text-decoration: none;
  `,
  helpIcon: css`
    border: 1px solid ${colors.linkExternal};
    border-radius: 100%;
    font-size: ${typography.size.xs};
    font-weight: ${typography.weight.bold};
    text-align: center;
    line-height: ${typography.size.sm};
    width: 14px;
    padding-left: 1px;
    user-select: none;
  `,
});
