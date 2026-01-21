import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LeadDocument = Lead & Document;

@Schema({ timestamps: true })
export class Lead {
  @Prop({ required: true, lowercase: true })
  email: string;

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop()
  phone?: string;

  @Prop({ enum: ['diagnosis', 'newsletter', 'contact', 'other'], default: 'diagnosis' })
  source: string;

  @Prop({ type: Object })
  diagnosisAnswers?: Record<string, any>;

  @Prop({ type: Object })
  diagnosisResults?: {
    scores?: Record<string, number>;
    recommendations?: Record<string, any>;
    risks?: Array<any>;
  };

  @Prop({ default: false })
  emailSent: boolean;

  @Prop()
  emailSentAt?: Date;

  @Prop({ default: false })
  converted: boolean; // Converted to paying customer

  @Prop()
  convertedAt?: Date;

  @Prop({ type: Object })
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
}

export const LeadSchema = SchemaFactory.createForClass(Lead);

// Indexes for better query performance
LeadSchema.index({ email: 1 });
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ converted: 1 });
