import { IsEmail, IsString, MinLength, IsOptional, IsIn } from "class-validator"

export class CreateUserDto {
  @IsEmail({}, { message: 'Email must be valid' })
  email: string

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string

  @IsString({ message: 'Name must be a string' })
  name: string

  @IsOptional()
  @IsString({ message: 'Role must be a string' })
  @IsIn(['admin', 'member'], { message: 'Role must be either admin or member' })
  role?: string = 'member'
}

export class LoginDto {
  @IsEmail({}, { message: 'Email must be valid' })
  email: string

  @IsString({ message: 'Password must be a string' })
  password: string
}