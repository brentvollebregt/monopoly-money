import { v1 as uuidv1 } from "uuid";

const createGameId = () => {
  const generateThreeDigitNumber = () => {
    const min = 100;
    const max = 1000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return `${generateThreeDigitNumber()}-${generateThreeDigitNumber()}`;
};

export const createUniqueGameId = (existingGameIds: string[]) => {
  while (true) {
    const newGameId = createGameId();
    if (existingGameIds.indexOf(newGameId) === -1) {
      return newGameId;
    }
  }
};

export const generateTimeBasedId = () => uuidv1();
