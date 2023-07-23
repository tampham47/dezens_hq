export const wait = async (ts: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, ts);
  });
};