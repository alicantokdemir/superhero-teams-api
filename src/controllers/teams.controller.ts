import { NextFunction, Request, Response } from 'express';
import { CreateTeamDto } from '../dtos/teams.dto';
import { Team } from '../interfaces/teams.interface';
import TeamService from '../services/teams.service';
import HeroTeamService from '../services/heroTeams.service';
import HeroService from '../services/heros.service';
import { Alignment } from '../enums/alignment.enum';
import { getMeanAlignment } from '../utils/util';
import * as isUUID from 'is-uuid';
import HttpException from '../exceptions/HttpException';

class TeamsController {
  public teamService = new TeamService();
  public heroService = new HeroService();
  public heroTeamService = new HeroTeamService();

  public getTeams = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teams: Team[] = await this.teamService.findAllTeams();
      res.status(200).json({ data: teams, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  }

  public getTeamsWithMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = [];
      const teams: Team[] = await this.teamService.findAllTeams();
      for (const team of teams) {
        const heroTeams = await this.heroTeamService.findAllByTeamId(team.id);
        const members = await this.heroService.findAllHeroByIds(heroTeams.map(ht => ht.heroId));
        const alignment: Alignment = getMeanAlignment(members);
        result.push({ ...team, members, alignment });
      }
      res.status(200).json({ data: result, message: 'findAllWithMembers' });
    } catch (error) {
      next(error);
    }
  }

  public getTeamById = async (req: Request, res: Response, next: NextFunction) => {
    const teamId: string = req.params.id;

    try {
      const team: Team = await this.teamService.findTeamById(teamId);
      if (!team) throw new HttpException(409, 'Team not found');
      res.status(200).json({ data: team, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  }

  public getTeamByIdWithMembers = async (req: Request, res: Response, next: NextFunction) => {
    const teamId: string = req.params.id;

    try {
      const team: Team = await this.teamService.findTeamById(teamId);
      if (!team) throw new HttpException(409, 'Team not found');
      const heroTeams = await this.heroTeamService.findAllByTeamId(team.id);
      const members = await this.heroService.findAllHeroByIds(heroTeams.map(ht => ht.heroId));
      const alignment: Alignment = getMeanAlignment(members);
      res.status(200).json({ data: { ...team, members, alignment }, message: 'findOneWithMembers' });
    } catch (error) {
      next(error);
    }
  }

  public createTeam = async (req: Request, res: Response, next: NextFunction) => {
    const teamData: CreateTeamDto = req.body;

    try {
      const team: Team = await this.teamService.createTeam(teamData);
      res.status(201).json({ data: team, message: 'created' });
    } catch (error) {
      next(error);
    }
  }

  public updateTeam = async (req: Request, res: Response, next: NextFunction) => {
    const teamId: string = req.params.id;
    const teamData: Team = req.body;

    try {
      const updatedTeamData: Team[] = await this.teamService.updateTeam(teamId, teamData);
      res.status(200).json({ data: updatedTeamData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  }

  public deleteTeam = async (req: Request, res: Response, next: NextFunction) => {    
    try {
      const teamId: string = req.params.id;
      if (!isUUID.anyNonNil(teamId)) throw new HttpException(400, 'Invalid team id');

      await this.heroTeamService.removeTeamFromAllHeros(teamId);
      
      const teams: Team[] = await this.teamService.deleteTeam(teamId);
      res.status(200).json({ data: teams, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  }
}

export default TeamsController;
