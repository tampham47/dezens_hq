export const getNumber = (value: bigint, dp: number) => {
  return Number(value / BigInt(Math.pow(10, dp)));
};
