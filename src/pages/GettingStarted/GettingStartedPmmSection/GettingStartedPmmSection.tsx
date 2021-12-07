import React, { FC } from 'react';
import { Messages } from './GettingStartedPmmSection.messages';
import { GettingStartedSection } from '../GettingStartedSection';
import { READ_MORE_LINK } from './GettingStartedPmmSection.constants';

export const GettingStartedPmmSection: FC = () => (
  <GettingStartedSection
    description={Messages.connectPMMDescription}
    title={Messages.connectPMMTitle}
    linkIcon="link"
    linkTo={READ_MORE_LINK}
    linkText={Messages.readMore}
  />
);
