import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';
import { OrganizationEntitlement } from 'core/api/types';
import { Messages } from './EntitlementsModal.messages';

const NEXT_CHILD = 1;

// TODO: we can remove the styles for the expiry date in the collapse after
// updating to Grafana 8 because the Collapse component already allows a ReactNode
// to be used as header there
export const getStyles = ({ palette, typography, spacing }: GrafanaTheme) => ({
  modalWrapper: (entitlements: OrganizationEntitlement[]) => css`
    div[data-testid="modal-body"] {
      height: 90vh;
      max-height: none;
      max-width: none;
      overflow: hidden;
      width: 90vw;
    }

    div[data-testid="modal-header"] {
      font-size: ${typography.size.lg};
      font-weight: ${typography.weight.bold};
    }

    div[data-testid="modal-content"] {
      max-height: calc(90vh - ${spacing.xl});
    }

    div[class$="collapse__header-label"] {
      position: relative;
    }

    ${entitlements.map(({ end_date }, i) => (
      `div[data-testid="modal-content"] {
        div[class$="panel-container"]:nth-child(${i + NEXT_CHILD}) {
          div[class$="collapse__header-label"] {
            width: 100%;

            &::after {
              content: "${Messages.expiryDate}: ${new Date(end_date).toLocaleDateString()}";
              color: ${palette.blue85};
              font-size: ${typography.size.sm};
              position: absolute;
              right: 0;
            }
          }
        }
      }`    
    ))}

  `,
  wrapper: css`
    padding-left: ${spacing.xl};
    position: relative;
    span {
      font-weight: ${typography.weight.bold};
      margin-right: ${spacing.xs};
    }

    p {
      margin: 0;
      margin-bottom: ${spacing.xs};

      &:nth-child(2) {
        margin-bottom: ${spacing.md};
      }
    }
  `,
  advisorsWrapper: css`
    margin-left: ${spacing.md};
  `,
});
