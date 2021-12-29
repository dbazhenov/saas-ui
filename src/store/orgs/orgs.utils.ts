import { PmmInstance } from 'store/types';

export interface PmmInstanceResponse {
  pmm_server_id: string;
  pmm_server_name: string;
  pmm_server_url: string;
}

export const transformInventory = (inventory: PmmInstanceResponse[]): PmmInstance[] =>
  inventory.map((pmmInstance) => ({
    id: pmmInstance.pmm_server_id,
    name: pmmInstance.pmm_server_name,
    url: pmmInstance.pmm_server_url,
  }));
