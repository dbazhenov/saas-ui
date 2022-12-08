import { FORM_PROFILE_WIDTH } from './Profile.constants';

export const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  form: {
    flex: 1,
    maxWidth: FORM_PROFILE_WIDTH,
  },
  legend: {
    textAlign: 'center',
    fontSize: 21,
    fontWeight: 'regular',
    m: 4,
    color: 'text.primary',
  },
  nameFields: {
    display: 'flex',
    '& > *': {
      flex: 1,
      justifyContent: 'space-between',
      '&:not(:last-child)': {
        mr: 2,
      },
    },
  },
  externalLink: {
    color: 'primary.main',
    fontWeight: 500,
    cursor: 'pointer',
    textDecoration: 'none',
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    mt: 2,
  },
  submitButton: {
    textTransform: 'capitalize',
    backgroundColor: 'primary.main',
    p: 0.4,
  },
  linkEditWrapper: {
    mt: 2,
    ml: 0.25,
  },
  linkConnectPMMWrapper: {
    lineHeight: 1.5,
    textAlign: 'justify',
    color: 'text.primary',
    ml: 0.25,
    mt: 1,
    mb: 4,
  },
  platformAccessTokenWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spanWrapper: {
    ml: 0.4,
  },
};
