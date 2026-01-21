import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { Lead, LeadSchema } from '../../models/lead.schema';
import { EmailService } from '../../services/email/email.service';
import { AIService } from '../../services/ai/ai.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lead.name, schema: LeadSchema }]),
  ],
  controllers: [LeadsController],
  providers: [LeadsService, EmailService, AIService],
  exports: [LeadsService],
})
export class LeadsModule {}
