import HttpException from '../exceptions/HttpException';
import { HeroTeam } from '../interfaces/heroTeams.interface';
import { heroTeamsModel } from '../models/heroTeams.model';

class HeroTeamService {
  public get heroTeams() {
    return heroTeamsModel;
  }
  
  public set heroTeams(newHeroTeams) {
    heroTeamsModel.length = 0;
    heroTeamsModel.push(...newHeroTeams);
  }

  public async findAll(): Promise<HeroTeam[]> {
    const heroTeams: HeroTeam[] = this.heroTeams;
    return heroTeams;
  }

  public async findAllByTeamId(teamId: string): Promise<HeroTeam[]> {
    const foundTeams: HeroTeam[] = this.heroTeams.filter(ht => ht.teamId === teamId);

    return foundTeams;
  }

  public async findAllByHeroId(heroId: string): Promise<HeroTeam[]> {
    const foundTeams: HeroTeam[] = this.heroTeams.filter(ht => ht.heroId === heroId);

    return foundTeams;
  }

  public async findByHeroAndTeamId(heroId: string, teamId: string): Promise<HeroTeam> {
    const foundTeam: HeroTeam = this.heroTeams.find(ht => (ht.heroId === heroId && ht.teamId === teamId));

    return foundTeam;
  }

  public async assignHeroToTeam(heroId: string, teamId: string): Promise<HeroTeam> {
    const foundHeroTeam: HeroTeam = await this.findByHeroAndTeamId(heroId, teamId);
    if (foundHeroTeam) throw new HttpException(409, 'Hero is already member of this team');

    const createdHeroTeam: HeroTeam = { heroId, teamId };
    this.heroTeams.push(createdHeroTeam);

    return createdHeroTeam;
  }

  public async removeHeroFromAllTeams(heroId: string): Promise<HeroTeam[]> {
    this.heroTeams = this.heroTeams.filter(ht => ht.heroId !== heroId);

    return this.heroTeams;
  }

  public async removeHeroFromTeam(heroId: string, teamId: string): Promise<HeroTeam[]> {
    this.heroTeams = this.heroTeams.filter(ht => ht.heroId !== heroId && ht.teamId !== teamId);

    return this.heroTeams;
  }

  public async removeTeamFromAllHeros(teamId: string): Promise<HeroTeam[]> {
    this.heroTeams = this.heroTeams.filter(ht => ht.teamId !== teamId);

    return this.heroTeams;
  }
}

export default HeroTeamService;
