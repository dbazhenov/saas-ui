export interface PmmInstance {
  id: string;
  name: string;
  url: string;
}

export interface OrgsState {
  inventory: PmmInstance[] | null;
}
