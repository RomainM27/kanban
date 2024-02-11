import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  order: number;

  description: string;

  @IsNotEmpty()
  sectionId: number;
}
