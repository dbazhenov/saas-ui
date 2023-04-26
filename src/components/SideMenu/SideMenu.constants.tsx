import React from 'react';
import { Routes } from 'core';
import { Icon } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LanOutlinedIcon from '@mui/icons-material/LanOutlined';
import ConnectedTvOutlinedIcon from '@mui/icons-material/ConnectedTvOutlined';
import { ReactComponent as SidebarK8s } from 'assets/percona-sidebar-k8s.svg';
import FormatQuoteOutlinedIcon from '@mui/icons-material/FormatQuoteOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import RunningWithErrorsOutlinedIcon from '@mui/icons-material/RunningWithErrorsOutlined';
import { Messages } from './SideMenu.messages';

export const resourcesLinks = {
  documentation: 'https://www.percona.com/software/documentation',
  blogs: 'https://www.percona.com/blog/',
  forum: 'https://forums.percona.com/',
  help: 'https://docs.percona.com/percona-platform/index.html',
};

export const mainMenu = [
  {
    label: Messages.dashboard,
    icon: <HomeOutlinedIcon />,
    to: Routes.root,
  },
  {
    label: Messages.organization,
    icon: <LanOutlinedIcon />,
    to: Routes.organization,
  },
  {
    label: Messages.instances,
    icon: <ConnectedTvOutlinedIcon />,
    to: Routes.instances,
  },
  {
    label: Messages.k8sCluster,
    icon: (
      <Icon>
        <SidebarK8s />
      </Icon>
    ),
    to: Routes.kubernetes,
  },
  {
    label: Messages.advisors,
    icon: (
      <Icon>
        <RunningWithErrorsOutlinedIcon />
      </Icon>
    ),
    to: Routes.advisors,
  },
];

export const resourcesMenu = [
  {
    label: Messages.documentation,
    icon: <FormatQuoteOutlinedIcon />,
    to: resourcesLinks.documentation,
  },
  {
    label: Messages.blogs,
    icon: <TextSnippetOutlinedIcon />,
    to: resourcesLinks.blogs,
  },
  {
    label: Messages.forum,
    icon: <MenuBookOutlinedIcon />,
    to: resourcesLinks.forum,
  },
  {
    label: Messages.help,
    icon: <HelpOutlineOutlinedIcon />,
    to: resourcesLinks.help,
  },
];
