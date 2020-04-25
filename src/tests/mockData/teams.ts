import { Team } from '../../interfaces/teams.interface';
import { v4 as uuidv4 } from 'uuid';

export const teamOne: Team = {
  id: uuidv4(),
  name: 'newTestTeamGood',
};

export const teamTwo: Team = {
  id: uuidv4(),
  name: 'newTestTeamBad',
};
