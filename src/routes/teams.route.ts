import { Router } from 'express';
import { CreateTeamDto } from '../dtos/teams.dto';
import Route from '../interfaces/routes.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import TeamsController from '../controllers/teams.controller';
import HeroTeamsController from '../controllers/heroTeams.controller';

class TeamsRoute implements Route {
  public path = '/teams';
  public router = Router();
  public teamsController = new TeamsController();
  public heroTeamsController = new HeroTeamsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/heroteams`, this.heroTeamsController.getHeroTeams);
    this.router.get(`${this.path}`, this.teamsController.getTeams);
    this.router.get(`${this.path}/detail`, this.teamsController.getTeamsWithMembers);
    this.router.get(`${this.path}/:id`, this.teamsController.getTeamById);
    this.router.get(`${this.path}/:id/detail`, this.teamsController.getTeamByIdWithMembers);
    this.router.post(`${this.path}`, validationMiddleware(CreateTeamDto), this.teamsController.createTeam);
    this.router.post(`${this.path}/:teamId/hero/:heroId`, this.heroTeamsController.assignHeroToTeam);
    this.router.put(`${this.path}/:id`, validationMiddleware(CreateTeamDto, true), this.teamsController.updateTeam);
    this.router.delete(`${this.path}/:id`, this.teamsController.deleteTeam);
    this.router.delete(`${this.path}/:teamId/hero/:heroId`, this.heroTeamsController.removeHeroFromTeam);
  }
}

export default TeamsRoute;
