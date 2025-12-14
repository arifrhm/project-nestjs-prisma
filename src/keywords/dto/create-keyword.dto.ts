import { IsString, IsNotEmpty } from 'class-validator';

export class CreateKeywordDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
