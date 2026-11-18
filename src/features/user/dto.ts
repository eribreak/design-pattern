import { IsEmail, IsString, IsNumber, IsOptional, Min } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  name!: string;

  @IsNumber()
  @Min(1)
  age!: number;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  age?: number;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  age: number | null;
  createdAt: Date;
  updatedAt: Date;
}