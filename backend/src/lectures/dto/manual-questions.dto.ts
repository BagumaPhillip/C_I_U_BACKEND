import { IsOptional, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionManualDto {
  @IsString()
  @IsNotEmpty()
  questionText: string;

  @IsNotEmpty()
  options: any[]; // Assuming options can be an array of strings or objects

  @IsNotEmpty()
  correctAnswer: any; // Correct answer can be a string or object, based on your structure
}



export class UpdateQuestionManualDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  questionText?: string;

  @IsOptional()
  options?: any[];

  @IsOptional()
  correctAnswer?: any;
}
