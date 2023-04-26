export interface AdvisorsListResponseError {
  status: number;
  data: {
    message: string;
    code: number;
    details: any[];
  };
}

export interface Checks {
  description: string;
  name: string;
  summary: string;
}

export interface Advisors {
  category: string;
  checks: Checks[];
  description: string;
  name: string;
  summary: string;
}

export interface AdvisorsListResponseData {
  advisors: AdvisorsResponse;
}

export interface AdvisorsResponse {
  anonymous: AdvisorsList;
  paid: AdvisorsList;
  registered: AdvisorsList;
}

export interface AdvisorsList {
  advisors: Advisors[];
}

export enum AdvisorsTabs {
  security = 'Security',
  configuration = 'Configuration',
  query = 'Query',
  performance = 'Performance',
}
