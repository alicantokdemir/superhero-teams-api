import { NextFunction, Request, Response } from 'express';
import { CreateHeroDto } from '../dtos/heros.dto';
import { Hero } from '../interfaces/heros.interface';
import TeamService from '../services/teams.service';
import HeroService from '../services/heros.service';
import HeroTeamService from '../services/heroTeams.service';
import { isEmptyObject } from '../utils/util';
import HttpException from '../exceptions/HttpException';
import * as isUUID from 'is-uuid';

class HerosController {
  public teamService = new TeamService();
  public heroService = new HeroService();
  public heroTeamService = new HeroTeamService();

  public getHeros = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const heros: Hero[] = await this.heroService.findAllHero();
      res.status(200).json({ data: heros, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  }

  public getHerosWithTeams = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = [];
      const heros: Hero[] = await this.heroService.findAllHero();
      for (const hero of heros) {
        const heroTeams = await this.heroTeamService.findAllByHeroId(hero.id);
        const teams = await this.teamService.findAllTeamByIds(heroTeams.map(ht => ht.teamId));
        result.push({ ...hero, teams });
      }
      res.status(200).json({ data: result, message: 'findAllWithTeams' });
    } catch (error) {
      next(error);
    }
  }

  public getHeroById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const heroId: string = req.params.id;
      const hero: Hero = await this.heroService.findHeroById(heroId);
      if (!hero) throw new HttpException(409, 'Hero not found');
      res.status(200).json({ data: hero, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  }

  public getHeroByIdWithTeams = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const heroId: string = req.params.id;
      const hero: Hero = await this.heroService.findHeroById(heroId);
      if (!hero) throw new HttpException(409, 'Hero not found');
      const heroTeams = await this.heroTeamService.findAllByHeroId(hero.id);
      const teams = await this.teamService.findAllTeamByIds(heroTeams.map(ht => ht.teamId));
      res.status(200).json({ data: { ...hero, teams }, message: 'findOneWithTeams' });
    } catch (error) {
      next(error);
    }
  }

  public createHero = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const heroData: CreateHeroDto = req.body;
      if (isEmptyObject(heroData)) throw new HttpException(400, 'Invalid hero data');
      const hero: Hero = await this.heroService.createHero(heroData);
      res.status(201).json({ data: hero, message: 'created' });
    } catch (error) {
      next(error);
    }
  }

  public updateHero = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const heroId: string = req.params.id;
      const heroData: Hero = req.body;

      if (!isUUID.anyNonNil(heroId)) throw new HttpException(400, 'Invalid hero id');
      if (isEmptyObject(heroData)) throw new HttpException(400, 'Invalid hero data');
      
      const updatedHeroData: Hero[] = await this.heroService.updateHero(heroId, heroData);
      res.status(200).json({ data: updatedHeroData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  }

  public deleteHero = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const heroId: string = req.params.id;
      if (!isUUID.anyNonNil(heroId)) throw new HttpException(400, 'Invalid hero id');
      
      await this.heroTeamService.removeHeroFromAllTeams(heroId);

      const heros: Hero[] = await this.heroService.deleteHero(heroId);
      res.status(200).json({ data: heros, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  }
}

export default HerosController;
