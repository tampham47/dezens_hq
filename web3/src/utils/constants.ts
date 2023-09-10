import { EnumPoolType, InvestProps } from '../types';

export const STATUS_POOL = {
  WAIT: 'Đang đợi đào',
  PAID: 'Thanh toán tiền thưởng',
};

export const BET_PRICE = [5, 10, 25, 50, 100, 250, 500];

export const poolsUp = [
  { id: 1, betUpPrice: 5 },
  { id: 2, betUpPrice: 5 },
  { id: 3, betUpPrice: 5 },
  { id: 4, betUpPrice: 5 },
  { id: 5, betUpPrice: 5 },
  { id: 6, betUpPrice: 5 },
  { id: 7, betUpPrice: 20 },
];

export const poolsDown = [
  { id: 1, betDownPrice: 5 },
  { id: 2, betDownPrice: 5 },
  { id: 3, betDownPrice: 5 },
  { id: 4, betDownPrice: 50 },
  { id: 5, betDownPrice: 5 },
  { id: 6, betDownPrice: 5 },
  { id: 7, betDownPrice: 5 },
];

export const InitialBet: InvestProps = {
  betPrice: 5,
  active: true,
  status: true,
};

export const HISTORY_GRAPH = [
  { id: 1, type: EnumPoolType.down },
  { id: 2, type: EnumPoolType.up },
  { id: 3, type: EnumPoolType.down },
  { id: 4, type: EnumPoolType.up },
  { id: 5, type: EnumPoolType.up },
  { id: 6, type: EnumPoolType.down },
  { id: 7, type: EnumPoolType.down },
  { id: 8, type: EnumPoolType.up },
  { id: 9, type: EnumPoolType.down },
];
