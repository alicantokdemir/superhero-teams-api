import * as request from 'supertest';
import App from '../app';
import { Alignment } from '../enums/alignment.enum';
import { Hero } from '../interfaces/heros.interface';
import { herosModel } from '../models/heros.model';
import { heroTeamsModel } from '../models/heroTeams.model';
import { teamsModel } from '../models/teams.model';
import { heroTeamOne } from './mockData/heroTeams';
import HeroRoute from '../routes/heros.route';
import { CreateHeroDto } from '../dtos/heros.dto';
import { heroOne, heroTwo } from './mockData/heros';
import { teamOne, teamTwo } from './mockData/teams';

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Heros', () => {
  describe('[GET] /heros', () => {
    it('response statusCode 200 / findAll', () => {
      const heros: Hero[] = herosModel;
      const herosRoute = new HeroRoute();
      const app = new App([herosRoute]);

      return request(app.getServer())
      .get(`${herosRoute.path}`)
      .expect(200, { data: heros, message: 'findAll' });
    });
  });

  describe('[GET] /heros/detail', () => {
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

    it('response statusCode 200 / findAllWithTeams', (done) => {
      const herosRoute = new HeroRoute();
      const app = new App([herosRoute]);
      const herosWTeams = [{
        ...heroOne,
        teams: [teamOne],
      }];

      return request(app.getServer())
      .get(`${herosRoute.path}/detail`)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body.data).toStrictEqual(herosWTeams);
        done();
      });
    });
  });

  describe('[GET] /heros/:id', () => {
    beforeAll(() => {
      herosModel.push(heroOne);
    });

    afterAll(() => {
      herosModel.splice(herosModel.findIndex(t => t.id === heroOne.id), 1);
    });

    it('response statusCode 200 / findOne', () => {
      const heros: Hero = herosModel.find(hero => hero.id === heroOne.id);

      const herosRoute = new HeroRoute();
      const app = new App([herosRoute]);

      return request(app.getServer())
      .get(`${herosRoute.path}/${heroOne.id}`)
      .expect(200, { data: heros, message: 'findOne' });
    });
  });

  describe('[GET] /heros/:id/detail', () => {
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

    it('response statusCode 200 / findOneWithTeams', (done) => {
      const hero = { ...heroOne, teams: [teamOne] };
      const herosRoute = new HeroRoute();
      const app = new App([herosRoute]);

      return request(app.getServer())
      .get(`${herosRoute.path}/${heroOne.id}/detail`)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body.data).toStrictEqual(hero);
        done();
      });
    });
  });

  describe('[POST] /heros', () => {
    it('response statusCode 201 / created', async () => {
      const heroData: CreateHeroDto = { ...heroOne };
      const herosRoute = new HeroRoute();
      const app = new App([herosRoute]);

      return request(app.getServer())
      .post(`${herosRoute.path}`)
      .send(heroData)
      .expect(201);
    });
  });

  describe('[POST] /heros/:heroId/team/:teamId', () => {
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
      const herosRoute = new HeroRoute();
      const app = new App([herosRoute]);

      return request(app.getServer())
      .post(`${herosRoute.path}/${heroOne.id}/team/${teamTwo.id}`)
      .send({})
      .expect(200);
    });
  });

  describe('[PUT] /heros/:id', () => {
    beforeAll(() => {
      herosModel.push(heroOne);
    });

    afterAll(() => {
      herosModel.splice(herosModel.findIndex(t => t.id === heroOne.id), 1);
    });

    it('response statusCode 200 / updated', async () => {

      const heroData: CreateHeroDto = {
        ...heroOne,
        name: 'newTestHeroUpdate',
        alignment: Alignment.BAD,
      };

      const herosRoute = new HeroRoute();
      const app = new App([herosRoute]);

      return request(app.getServer())
      .put(`${herosRoute.path}/${heroOne.id}`)
      .send(heroData)
      .expect(200);
    });
  });

  describe('[DELETE] /heros/:id', () => {
    beforeAll(() => {
      herosModel.push(heroOne);
    });

    afterAll(() => {
      herosModel.splice(herosModel.findIndex(t => t.id === heroOne.id), 1);
    });

    it('response statusCode 200 / deleted', () => {
      const remainingheros: Hero[] = herosModel.filter(hero => hero.id !== heroOne.id);
      const herosRoute = new HeroRoute();
      const app = new App([herosRoute]);

      return request(app.getServer())
      .delete(`${herosRoute.path}/${heroOne.id}`)
      .expect(200, { data: remainingheros, message: 'deleted' });
    });
  });

  describe('[DELETE] /heros/:heroId/team/:teamId', () => {
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
      const herosRoute = new HeroRoute();
      const app = new App([herosRoute]);

      return request(app.getServer())
      .delete(`${herosRoute.path}/${heroOne.id}/team/${teamOne.id}`)
      .send({})
      .expect(200);
    });
  });
});
