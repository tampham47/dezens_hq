export enum EnumPoolType {
  up = 'up',
  down = 'down',
}
export enum EnumTradeType {
  open = 'open',
  digging = 'digging',
  result = 'result',
}

export type PoolProps = {
  data?: any[];
  type: EnumPoolType;
  disabled: boolean;
  onJoinPool: (pool: string) => void;
};

export type StatsProps = {
  type: EnumPoolType;
  betPrice?: number;
  callback?: any;
  percent?: number;
};

export type TimerProps = {
  phase?: TimePhase;
  callback?: () => void;
  status: string;
};

export type TimePhase = {
  timer: number;
  tradephase: string;
};

export type InvestProps = {
  active: boolean;
  status?: boolean;
  betUpPrice?: number;
  betPrice: number;
  betDownPrice?: number;
  callback?: (price: number) => void;
};

export interface IHistoryProps {
  type: string;
  key?: any;
}
