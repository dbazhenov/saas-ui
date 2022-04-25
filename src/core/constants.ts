export const TERMS_OF_SERVICE_URL = 'https://per.co.na/pmm/platform-terms';

export const PRIVACY_PMM_URL = 'https://per.co.na/pmm/platform-privacy';

export const DOWNLOAD_PMM_LINK = 'https://www.percona.com/downloads/pmm2';

export const SENTRY_DSN = 'https://fe7cfc4487d846d58d0273bd2be7dc91@o1209311.ingest.sentry.io/6361088';

export const PORTAL_HOST = window.location.host;

export const PORTAL_ORIGIN = window.location.origin;

export const IS_PRODUCTION = PORTAL_HOST === 'portal.percona.com';

export const OAUTH_HOST = IS_PRODUCTION
  ? process.env.REACT_APP_OAUTH_PROD_HOST
  : process.env.REACT_APP_OAUTH_DEV_HOST;

export const OAUTH_CLIENT_ID = IS_PRODUCTION
  ? process.env.REACT_APP_OAUTH_PROD_CLIENT_ID
  : process.env.REACT_APP_OAUTH_DEV_CLIENT_ID;

export const OAUTH_ISSUER_URI = IS_PRODUCTION
  ? process.env.REACT_APP_OAUTH_PROD_ISSUER_URI
  : process.env.REACT_APP_OAUTH_DEV_ISSUER_URI;

export const STATE_LOCALSTORAGE_KEY = 'state';

export const THEME_STORAGE_KEY = 'percona.saas.theme';

export const MAX_NAME_LENGTH = 50;

export const PASSWORD_MIN_LENGTH = 10;

export const OKTA_TOKEN_STORE_LOCALSTORAGE_KEY = 'okta-token-storage';

// eslint-disable-next-line no-magic-numbers
export const SENTRY_TRACES_SAMPLE_RATE = IS_PRODUCTION ? 0.5 : 1.0;

export const ENVIRONMENT = IS_PRODUCTION ? 'production' : 'development';
