import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Authmodule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [Authmodule, UserModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}