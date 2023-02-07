import { FC, SVGProps } from 'react';

export interface USPCardProps {
  icon: FC<SVGProps<SVGSVGElement>>;
  title: string;
  text: string;
}
