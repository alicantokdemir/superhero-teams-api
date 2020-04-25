import * as isUUID from 'is-uuid';
import { v4 as uuidv4 } from 'uuid';
import { CreateHeroDto } from '../dtos/heros.dto';
import HttpException from '../exceptions/HttpException';
import { Hero } from '../interfaces/heros.interface';
import { herosModel } from '../models/heros.model';

class HeroService {
  public get heros() {
    return herosModel;
  }
  
  public set heros(newHeros) {
    herosModel.length = 0;
    herosModel.push(...newHeros);
  }

  public async findAllHero(): Promise<Hero[]> {
    const heros: Hero[] = this.heros;
    return heros;
  }

  public async findHeroById(heroId: string): Promise<Hero> {
    const foundHero: Hero = this.heros.find(hero => hero.id === heroId);
    return foundHero;
  }

  public async findAllHeroByIds(heroIds: string[]): Promise<Hero[]> {
    const foundHeros: Hero[] = heroIds.map(heroId => this.heros.find(hero => hero.id === heroId));
    if (foundHeros.length !== heroIds.length) throw new HttpException(409, 'Heros not found');

    return foundHeros;
  }

  public async createHero(heroData: CreateHeroDto): Promise<Hero> {
    const foundHero: Hero = this.heros.find(hero  => hero.name === heroData.name);
    if (foundHero) throw new HttpException(409, `Hero with name ${heroData.name} already exists`);

    const createdHero: Hero = { id: uuidv4(), ...heroData };
    this.heros.push(createdHero);

    return createdHero;
  }

  public async updateHero(heroId: string, heroData: Hero): Promise<Hero[]> {
    const foundHero: Hero = this.heros.find(hero => hero.id === heroId);
    if (!foundHero) throw new HttpException(409, 'Hero not found');

    this.heros = this.heros.map((hero: Hero) => {
      if (hero.id === foundHero.id) hero = { id: heroId, ...heroData };
      return hero;
    });

    return this.heros;
  }

  public async deleteHero(heroId: string): Promise<Hero[]> {
    if (!isUUID.anyNonNil(heroId)) throw new HttpException(400, 'Invalid hero id');

    const foundHero: Hero = this.heros.find(hero => hero.id === heroId);
    if (!foundHero) throw new HttpException(409, 'Hero not found');

    this.heros = this.heros.filter(hero => hero.id !== foundHero.id);

    return this.heros;
  }
}

export default HeroService;
