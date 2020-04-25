import { HeroTeam } from '../../interfaces/heroTeams.interface';
import { teamOne, teamTwo } from './teams';
import { heroOne, heroTwo } from './heros';

export const heroTeamOne: HeroTeam = {
  heroId: heroOne.id,
  teamId: teamOne.id,
};

export const heroTeamTwo: HeroTeam = {
  heroId: heroTwo.id,
  teamId: teamTwo.id,
};
