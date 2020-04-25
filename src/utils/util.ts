import { Alignment } from '../enums/alignment.enum';
import { Hero } from '../interfaces/heros.interface';

export const isEmptyObject = (obj: object): boolean => {
  return !Object.keys(obj).length;
};

export const getMeanAlignment = (heros: Hero[]): Alignment => {
  let g = 0;
  let b = 0;
  let n = 0;
  heros.forEach((h) => {
    switch (h.alignment) {
      case Alignment.GOOD:
        g += 1;
        break;
      case Alignment.BAD:
        b += 1;
        break;
      default:
        n += 1;
    }
  });

  if (g === b) {
    return Alignment.NEUTRAL;
  }

  if (g > b) {
    return Alignment.GOOD;
  }

  if (b > g) {
    return Alignment.BAD;
  }

  return Alignment.NEUTRAL;
};
