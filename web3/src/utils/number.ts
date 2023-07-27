import { isNumber as _isNumber, replace } from 'lodash';

const NumberFormat: Record<string, Intl.NumberFormat> = {
  currency: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }),
  number: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }),
  n0: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    minimumSignificantDigits: 2,
    maximumSignificantDigits: 3,
  }),
  n1: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    minimumSignificantDigits: 2,
    maximumSignificantDigits: 3,
  }),
  n2: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    minimumSignificantDigits: 2,
    maximumSignificantDigits: 5,
  }),
  n3: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
    minimumSignificantDigits: 2,
    maximumSignificantDigits: 5,
  }),
  n4: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
    minimumSignificantDigits: 2,
    maximumSignificantDigits: 5,
  }),
  n5: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 5,
    minimumSignificantDigits: 2,
    maximumSignificantDigits: 5,
  }),
  n6: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 5,
    minimumSignificantDigits: 2,
    maximumSignificantDigits: 5,
  }),
  n7: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 5,
    minimumSignificantDigits: 2,
    maximumSignificantDigits: 5,
  }),
  n8: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 5,
    minimumSignificantDigits: 2,
    maximumSignificantDigits: 5,
  }),

  p0: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }),
  p1: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }),
  p2: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
  p3: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }),
  p4: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }),
  p5: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
  }),
  p6: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 6,
    maximumFractionDigits: 6,
  }),
  p7: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 7,
    maximumFractionDigits: 7,
  }),
  p8: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  }),
};

export const toFloat = (raw: string | number) => {
  if (typeof raw === 'string') {
    return parseFloat(replace(raw, ',', ''));
  }
  return raw;
};

export const getDisplayedNumber = (raw?: number, dp: number = 0) => {
  if (!raw) return '0';
  const value = toFloat(raw);
  return NumberFormat[`p${Math.min(8, dp)}`].format(value);
};

export const getAutoRoundNumber = (raw: any, maxSigFig: number = 5) => {
  const value = toFloat(raw);
  return NumberFormat[`n${Math.min(8, maxSigFig)}`].format(value);
};
