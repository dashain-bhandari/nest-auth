import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit,OnModuleDestroy {

    constructor(){
        super({
            datasources:{
                db:{
                    url:"postgresql://postgres:postgres@localhost:5432/nest_auth?schema=public"
                }
            }
        })
    }

   async onModuleDestroy() {
      await this.$connect();
    }
    async onModuleInit() {
        await this.$disconnect()
    }
}
