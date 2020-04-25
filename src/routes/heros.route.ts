import { Router } from 'express';
import HerosController from '../controllers/heros.controller';
import { CreateHeroDto } from '../dtos/heros.dto';
import Route from '../interfaces/routes.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import HeroTeamsController from '../controllers/heroTeams.controller';

class HerosRoute implements Route {
  public path = '/heros';
  public router = Router();
  public herosController = new HerosController();
  public heroTeamsController = new HeroTeamsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.herosController.getHeros);
    this.router.get(`${this.path}/detail`, this.herosController.getHerosWithTeams);
    this.router.get(`${this.path}/:id`, this.herosController.getHeroById);
    this.router.get(`${this.path}/:id/detail`, this.herosController.getHeroByIdWithTeams);
    this.router.post(`${this.path}`, validationMiddleware(CreateHeroDto), this.herosController.createHero);
    this.router.post(`${this.path}/:heroId/team/:teamId`, this.heroTeamsController.assignHeroToTeam);
    this.router.put(`${this.path}/:id`, validationMiddleware(CreateHeroDto, true), this.herosController.updateHero);
    this.router.delete(`${this.path}/:id`, this.herosController.deleteHero);
    this.router.delete(`${this.path}/:heroId/team/:teamId`, this.heroTeamsController.removeHeroFromTeam);
  }
}

export default HerosRoute;
