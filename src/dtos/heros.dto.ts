import { IsOptional, IsArray, IsString, IsEnum } from 'class-validator';
import { Alignment } from '../enums/alignment.enum';

export class CreateHeroDto {
  @IsString({
    message: 'Please provide a name.',
  })
  public name: string;

  @IsEnum(Alignment, {
    message: 'Please provide a valid alignment.',
  })
  public alignment: Alignment;

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Please provide a valid array of teams.' })
  public teams?: string[];
}
