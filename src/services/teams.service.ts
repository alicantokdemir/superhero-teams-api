import * as isUUID from 'is-uuid';
import { v4 as uuidv4 } from 'uuid';
import { CreateTeamDto } from '../dtos/teams.dto';
import HttpException from '../exceptions/HttpException';
import { Team } from '../interfaces/teams.interface';
import { teamsModel } from '../models/teams.model';
import { isEmptyObject } from '../utils/util';

class TeamService {
  public get teams() {
    return teamsModel;
  }
  
  public set teams(newTeams) {
    teamsModel.length = 0;
    teamsModel.push(...newTeams);
  }

  public async findAllTeams(): Promise<Team[]> {
    const teams: Team[] = this.teams;
    return teams;
  }

  public async findTeamById(teamId: string): Promise<Team> {
    const foundTeam: Team = this.teams.find(team => team.id === teamId);
    return foundTeam;
  }

  public async findAllTeamByIds(teamIds: string[]): Promise<Team[]> {
    const foundTeams: Team[] = teamIds.map(teamId => this.teams.find(team => team.id === teamId));
    if (foundTeams.length !== teamIds.length) throw new HttpException(409, 'Teams not found');

    console.log('teams => ', this.teams);
    console.log('foundTeams => ', foundTeams);
    return foundTeams;
  }

  public async createTeam(teamData: CreateTeamDto): Promise<Team> {
    if (isEmptyObject(teamData)) throw new HttpException(400, 'Invalid team data');

    const foundTeam: Team = this.teams.find(team  => team.name === teamData.name);
    if (foundTeam) throw new HttpException(409, `Team with name ${teamData.name} already exists`);

    const createdTeam: Team = { id: uuidv4(), ...teamData };
    this.teams.push(createdTeam);

    return createdTeam;
  }

  public async updateTeam(teamId: string, teamData: Team): Promise<Team[]> {
    if (!isUUID.anyNonNil(teamId)) throw new HttpException(400, 'Invalid team id');
    if (isEmptyObject(teamData)) throw new HttpException(400, 'Invalid team data');

    const foundTeam: Team = this.teams.find(team => team.id === teamId);
    if (!foundTeam) throw new HttpException(409, 'Team not found');

    this.teams = this.teams.map((team: Team) => {
      if (team.id === foundTeam.id) team = { id: teamId, ...teamData };
      return team;
    });

    return this.teams;
  }

  public async deleteTeam(teamId: string): Promise<Team[]> {
    if (!isUUID.anyNonNil(teamId)) throw new HttpException(400, 'Invalid team id');

    const foundTeam: Team = this.teams.find(team => team.id === teamId);
    if (!foundTeam) throw new HttpException(409, 'Team not found');

    this.teams = this.teams.filter(team => team.id !== foundTeam.id);

    return this.teams;
  }
}

export default TeamService;
