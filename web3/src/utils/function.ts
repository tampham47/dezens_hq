export const generateTotalPrice = (arr: any) => {
  let sum = 0;
  if (!arr) {
    sum = 0;
  }
  arr?.map((item: any) => (sum += item?.betUpPrice ?? item?.betDownPrice));

  return sum;
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
