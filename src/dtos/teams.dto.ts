import { IsArray, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateTeamDto {
  @IsString({
    message: 'Please provide a name.',
  })
  public name: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Please provide a valid array of members.' })
  public members?: string[];
}
