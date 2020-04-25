import { Alignment } from '../enums/alignment.enum';

export interface Hero {
  id: string; // uuid
  name: string;
  alignment: Alignment;
}
