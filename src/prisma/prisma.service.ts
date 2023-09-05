import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService {
  public prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: 'mongodb+srv://aman:pass123@cluster0.rdg7ett.mongodb.net/dbuser',
        },
      },
    });
  }
}

