import { IsString, MinLength, Matches, IsObject } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MinLength(3)
  @Matches(/^(\s*[\d\w]+([.]?[\d\w]+)+\s*)+$/)
  event: string;

  @IsObject()
  payload: object;
}
