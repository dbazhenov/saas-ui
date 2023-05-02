export interface ClusterStatusError {
  status: number;
  data: {
    message: string;
    code: number;
    details: any[];
  };
}
