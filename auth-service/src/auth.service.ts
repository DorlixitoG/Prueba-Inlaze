import { Injectable, UnauthorizedException,BadRequestException } from "@nestjs/common"
import  { Model } from "mongoose"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import  { UserDocument } from "./schemas/user.schema"
import  { CreateUserDto, LoginDto } from "./dto/auth.dto"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class AuthService {
constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

 async register(createUserDto: CreateUserDto) {
    console.log('Auth Service - Received DTO:', createUserDto)
    
    // Validar que los datos requeridos estén presentes
    if (!createUserDto.email || !createUserDto.password || !createUserDto.name) {
      console.error('Auth Service - Missing required fields')
      throw new BadRequestException('Email, password, and name are required')
    }

    try {
      console.log('Auth Service - Checking existing user...')
      const existingUser = await this.userModel.findOne({ email: createUserDto.email })
      
      if (existingUser) {
        console.log(' Auth Service - User already exists')
        throw new BadRequestException("User already exists")
      }

      console.log('Auth Service - Hashing password...')
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
      
      console.log('Auth Service - Creating user object...')
      const userData = {
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
        role: createUserDto.role || 'member'
      }
      
      console.log('Auth Service - User data to save:', { ...userData, password: '***' })
      
      const user = new this.userModel(userData)
      await user.save()
      
      console.log(' Auth Service - User saved successfully')
      
      const { password, ...result } = user.toObject()
      return result
    } catch (error) {
      console.error(' Auth Service - Error:', error.message)
      throw error
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email })
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const payload = { sub: user._id, email: user.email, role: user.role }
    const token = this.jwtService.sign(payload)

    const { password, ...userResult } = user.toObject()
    return { user: userResult, token }
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token)
      const user = await this.userModel.findById(payload.sub).select("-password")
      return { valid: true, user }
    } catch (error) {
      return { valid: false, user: null }
    }
  }

  async getUserById(userId: string) {
    const user = await this.userModel.findById(userId).select("-password")
    return user
  }
  async getUsers() {
  return this.userModel.find({}, { password: 0 }).select('_id username email')
}
async getAllUsers() {
  const users = await this.userModel.find().select("-password")
  return users.map((user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }))
}
}
