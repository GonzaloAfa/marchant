import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const mongoUri = configService.get('MONGODB_URI') || 
          `mongodb://${configService.get('MONGODB_HOST', 'localhost')}:${configService.get('MONGODB_PORT', 27017)}/${configService.get('MONGODB_DATABASE', 'marchant')}`;
        
        return {
          uri: mongoUri,
          retryWrites: true,
          w: 'majority',
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
