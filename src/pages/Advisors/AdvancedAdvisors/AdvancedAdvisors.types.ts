import { Checks } from '../Advisors.types';

export interface AdvancedAdvisorsProps {
  category: string;
  checks: Checks[];
  description: string;
  name: string;
  summary: string;
}

export interface ShowAdvancedAdvisorsProps {
  advisors: AdvancedAdvisorsProps[];
}
