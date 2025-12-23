const sum = (a: number, b: number): number => {
  return a + b;
};

const getRandomNumber = (): number => {
  return Math.floor(Math.random() * 100);
};

export { sum, getRandomNumber };
