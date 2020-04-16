import { v1 as uuidv1, v4 as uuidv4 } from "uuid";

const createGameId = () => {
  const min = 100000;
  const max = 1000000;
  return `${Math.floor(Math.random() * (max - min + 1)) + min}`;
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
export const generateRandomId = () => uuidv4();

export const getCurrentTime = () => new Date().toISOString();
