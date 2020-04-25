import * as request from 'supertest';
import App from '../app';
import { Alignment } from '../enums/alignment.enum';
import { Team } from '../interfaces/teams.interface';
import { teamsModel } from '../models/teams.model';
import TeamRoute from '../routes/teams.route';
import { CreateTeamDto } from '../dtos/teams.dto';
import { teamOne, teamTwo } from './mockData/teams';
import { herosModel } from '../models/heros.model';
import { heroTeamsModel } from '../models/heroTeams.model';
import { heroOne } from './mockData/heros';
import { heroTeamOne } from './mockData/heroTeams';
import TeamsRoute from '../routes/teams.route';

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Teams', () => {
  describe('[GET] /teams', () => {
    it('response statusCode 200 / findAll', () => {
      const teams: Team[] = teamsModel;
      const teamsRoute = new TeamRoute();
      const app = new App([teamsRoute]);

      return request(app.getServer())
      .get(`${teamsRoute.path}`)
      .expect(200, { data: teams, message: 'findAll' });
    });
  });

  describe('[GET] /teams/detail', () => {
    beforeAll(() => {
      herosModel.push(heroOne);
      teamsModel.push(teamOne);
      heroTeamsModel.push(heroTeamOne);
    });

    afterAll(() => {
      herosModel.splice(herosModel.findIndex(h => h.id === heroOne.id), 1);
      teamsModel.splice(teamsModel.findIndex(t => t.id === teamOne.id), 1);
      heroTeamsModel.splice(heroTeamsModel.findIndex(ht => ht.teamId === teamOne.id && ht.heroId === heroOne.id));
    });

    it('response statusCode 200 / findAllWithMembers', (done) => {
      const teamsRoute = new TeamRoute();
      const app = new App([teamsRoute]);
      const teamsWMembers = [{
        ...teamOne,
        members: [heroOne],
        alignment: heroOne.alignment,
      }];

      return request(app.getServer())
      .get(`${teamsRoute.path}/detail`)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body.data).toStrictEqual(teamsWMembers);
        done();
      });
    });
  });

  describe('[GET] /teams/:id', () => {
    beforeAll(() => {
      teamsModel.push(teamOne);
    });

    afterAll(() => {
      teamsModel.splice(teamsModel.findIndex(t => t.id === teamOne.id), 1);
    });

    it('response statusCode 200 / findOne', () => {
      const foundTeam: Team = teamsModel.find(team => team.id === teamOne.id);
      const teamsRoute = new TeamRoute();
      const app = new App([teamsRoute]);

      return request(app.getServer())
      .get(`${teamsRoute.path}/${teamOne.id}`)
      .expect(200, { data: foundTeam, message: 'findOne' });
    });
  });

  describe('[GET] /teams/:id/detail', () => {
    beforeAll(() => {
      herosModel.push(heroOne);
      teamsModel.push(teamOne);
      heroTeamsModel.push(heroTeamOne);
    });

    afterAll(() => {
      herosModel.splice(herosModel.findIndex(h => h.id === heroOne.id), 1);
      teamsModel.splice(teamsModel.findIndex(t => t.id === teamOne.id), 1);
      heroTeamsModel.splice(heroTeamsModel.findIndex(ht => ht.teamId === teamOne.id && ht.heroId === heroOne.id));
    });

    it('response statusCode 200 / findOneWithMembers', (done) => {
      const team = { ...teamOne, members: [heroOne], alignment: heroOne.alignment, };
      const teamsRoute = new TeamRoute();
      const app = new App([teamsRoute]);

      return request(app.getServer())
      .get(`${teamsRoute.path}/${teamOne.id}/detail`)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body.data).toStrictEqual(team);
        done();
      });
    });
  });

  describe('[POST] /teams', () => {
    it('response statusCode 201 / created', async () => {
      const teamData: CreateTeamDto = { ...teamOne };

      const teamsRoute = new TeamRoute();
      const app = new App([teamsRoute]);

      return request(app.getServer())
      .post(`${teamsRoute.path}`)
      .send(teamData)
      .expect(201);
    });
  });

  describe('[POST] /teams/:teamId/hero/:heroId', () => {
    beforeAll(() => {
      herosModel.push(heroOne);
      teamsModel.push(teamOne);
      teamsModel.push(teamTwo);
      heroTeamsModel.push(heroTeamOne);
    });

    afterAll(() => {
      herosModel.splice(herosModel.findIndex(h => h.id === heroOne.id), 1);
      teamsModel.splice(teamsModel.findIndex(t => t.id === teamOne.id), 1);
      teamsModel.splice(teamsModel.findIndex(t => t.id === teamTwo.id), 1);
      heroTeamsModel.splice(heroTeamsModel.findIndex(ht => ht.teamId === teamOne.id && ht.heroId === heroOne.id));
    });

    it('response statusCode 200 / assignHeroToTeam', async () => {
      const teamsRoute = new TeamsRoute();
      const app = new App([teamsRoute]);

      return request(app.getServer())
      .post(`${teamsRoute.path}/${teamTwo.id}/hero/${heroOne.id}`)
      .send({})
      .expect(200);
    });
  });

  describe('[PUT] /teams/:id', () => {
    beforeAll(() => {
      teamsModel.push(teamOne);
    });

    afterAll(() => {
      teamsModel.splice(teamsModel.findIndex(t => t.id === teamOne.id), 1);
    });

    it('response statusCode 200 / updated', async () => {
      const teamData: CreateTeamDto = {
        ...teamOne,
        name: 'newTestTeamUpdate',
      };

      const teamsRoute = new TeamRoute();
      const app = new App([teamsRoute]);

      return request(app.getServer())
      .put(`${teamsRoute.path}/${teamOne.id}`)
      .send(teamData)
      .expect(200);
    });
  });

  describe('[DELETE] /teams/:id', () => {
    beforeAll(() => {
      teamsModel.push(teamOne);
    });

    afterAll(() => {
      teamsModel.splice(teamsModel.findIndex(t => t.id === teamOne.id), 1);
    });

    it('response statusCode 200 / deleted', () => {
      const remainingTeams: Team[] = teamsModel.filter(team => team.id !== teamOne.id);
      const teamsRoute = new TeamRoute();
      const app = new App([teamsRoute]);

      return request(app.getServer())
      .delete(`${teamsRoute.path}/${teamOne.id}`)
      .expect(200, { data: remainingTeams, message: 'deleted' });
    });
  });

  describe('[DELETE] /teams/:teamId/hero/:heroId', () => {
    beforeAll(() => {
      herosModel.push(heroOne);
      teamsModel.push(teamOne);
      heroTeamsModel.push(heroTeamOne);
    });

    afterAll(() => {
      herosModel.splice(herosModel.findIndex(h => h.id === heroOne.id), 1);
      teamsModel.splice(teamsModel.findIndex(t => t.id === teamOne.id), 1);
      heroTeamsModel.splice(heroTeamsModel.findIndex(ht => ht.teamId === teamOne.id && ht.heroId === heroOne.id));
    });

    it('response statusCode 200 / removeHeroFromTeam', async () => {
      const teamsRoute = new TeamsRoute();
      const app = new App([teamsRoute]);

      return request(app.getServer())
      .delete(`${teamsRoute.path}/${teamOne.id}/hero/${heroOne.id}`)
      .send({})
      .expect(200);
    });
  });
});
