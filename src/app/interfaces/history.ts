export type SingleHistory = {
  id: string;
  success: string;
  time: string;
};
export interface History {
  count: number;
  history: SingleHistory[];
}
