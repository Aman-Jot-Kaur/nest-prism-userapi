import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signin(dto:AuthDto) {
    const user = await this.prismaService.prisma.user.findFirst({
     where:{
      email:dto.email
     }
    });
    if(!user){
      throw new ForbiddenException('Credentials incorrect')
    }

    
    const passwordMtach= await argon.verify(user.hash,dto.password)
    if(!passwordMtach){
      throw new ForbiddenException('password incorrect')
    }
    delete user.hash
    return user 
  }

  async signup(dto: AuthDto) {
    try { // <-- Start of the try block
      const hash = await argon.hash(dto.password);

      // Use the Prisma Client to create a new user
      const user = await this.prismaService.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
        },
        select: {
          email: true, // Include email while returning user
          hash: false, // Return user without password
        },
      });

      return user;
    } catch (error) { // <-- Start of the catch block
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    } // <-- End of the catch block
  } 
}
