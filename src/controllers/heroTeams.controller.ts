import { NextFunction, Request, Response } from 'express';
import { Hero } from '../interfaces/heros.interface';
import { Team } from '../interfaces/teams.interface';
// import { HeroTeam } from '../interfaces/heroTeams.interface';
import { heroTeamsModel } from '../models/heroTeams.model';
import { herosModel } from '../models/heros.model';
import { teamsModel } from '../models/teams.model';
import TeamService from '../services/teams.service';
import HeroService from '../services/heros.service';
import HeroTeamService from '../services/heroTeams.service';
import * as isUUID from 'is-uuid';
import HttpException from '../exceptions/HttpException';

class HeroTeamsController {
  public teamService = new TeamService();
  public heroService = new HeroService();
  public heroTeamService = new HeroTeamService();

  public getHeroTeams = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const heroTeams: HeroTeam[] = await this.heroTeamService.findAll();
      res.status(200).json({ data: { heroTeamsModel, herosModel, teamsModel }, message: 'findAllHeroTeams' });
    } catch (error) {
      next(error);
    }
  }

  public assignHeroToTeam = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const heroId: string = req.params.heroId;
      const teamId: string = req.params.teamId;
      
      if (!isUUID.anyNonNil(heroId)) throw new HttpException(400, 'Invalid hero id');
      if (!isUUID.anyNonNil(teamId)) throw new HttpException(400, 'Invalid team id');
      
      const hero: Hero = await this.heroService.findHeroById(heroId);
      if (!hero) throw new HttpException(409, 'Hero not found');
      
      const team: Team = await this.teamService.findTeamById(teamId);
      if (!team) throw new HttpException(409, 'Team not found');
    
      const createdHeroTeam = await this.heroTeamService.assignHeroToTeam(heroId, teamId);
      res.status(200).json({ data: createdHeroTeam, message: 'assignHeroToTeam' });
    } catch (error) {
      next(error);
    }
  }

  public removeHeroFromTeam = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const heroId: string = req.params.heroId;
      const teamId: string = req.params.teamId;
      
      if (!isUUID.anyNonNil(heroId)) throw new HttpException(400, 'Invalid hero id');
      if (!isUUID.anyNonNil(teamId)) throw new HttpException(400, 'Invalid team id');
      
      await this.heroTeamService.removeHeroFromTeam(heroId, teamId);

      res.status(200).json({ message: 'removeHeroFromTeam' });
    } catch (error) {
      next(error);
    }
  }
}

export default HeroTeamsController;
