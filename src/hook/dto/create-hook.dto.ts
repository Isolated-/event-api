import {
  IsString,
  IsBoolean,
  IsUrl,
  IsOptional,
  MinLength,
} from 'class-validator';
export class CreateHookDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsUrl()
  url: string;

  @IsString({ each: true })
  event: string[];

  @IsString()
  @IsOptional()
  secret: string;

  @IsBoolean()
  @IsOptional()
  rotate: boolean = false;
}
