import { Hero } from '../../interfaces/heros.interface';
import { Alignment } from '../../enums/alignment.enum';
import { v4 as uuidv4 } from 'uuid';

export const heroOne: Hero = {
  id: uuidv4(),
  name: 'newTestHeroGood',
  alignment: Alignment.GOOD,
};

export const heroTwo: Hero = {
  id: uuidv4(),
  name: 'newTestHeroBad',
  alignment: Alignment.BAD,
};
