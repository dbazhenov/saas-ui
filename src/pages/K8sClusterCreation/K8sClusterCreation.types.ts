export interface K8sClusterStatusError {
  status: number;
  data: {
    message: string;
    code: number;
    details: any[];
  };
}
