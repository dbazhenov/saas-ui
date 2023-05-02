import React, { FC } from 'react';
import { Box, Stack } from '@mui/material';
import { AppHeader, SideMenu } from 'components';
import { HEADER_HEIGHT } from './PrivateLayout.constants';

export const PrivateLayout: FC = ({ children }) => (
  <Box>
    <Stack direction="row">
      <SideMenu />
      <Stack display="flex" flexGrow={1} position="relative">
        <AppHeader />
        <Box display="flex" flexGrow={1} sx={{ py: 1, px: 3 }} mt={`${HEADER_HEIGHT}px`}>
          {children}
        </Box>
      </Stack>
    </Stack>
  </Box>
);
