import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lead, LeadDocument } from '../../models/lead.schema';
import { CreateLeadDto, SubmitDiagnosisDto } from './dto/lead.dto';
import { AIService } from '../../services/ai/ai.service';
import { EmailService } from '../../services/email/email.service';
import { LoggerService } from '../../services/logger/logger.service';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
    private aiService: AIService,
    private emailService: EmailService,
    private logger: LoggerService,
  ) {}

  async createLead(createLeadDto: CreateLeadDto) {
    // Check if lead already exists
    const existingLead = await this.leadModel.findOne({ 
      email: createLeadDto.email.toLowerCase() 
    }).exec();

    if (existingLead) {
      // Return existing lead (don't throw error, just return it)
      return {
        leadId: existingLead._id.toString(),
        email: existingLead.email,
        message: 'Lead ya existe',
        existing: true,
      };
    }

    // Create new lead
    const lead = await this.leadModel.create({
      email: createLeadDto.email.toLowerCase(),
      firstName: createLeadDto.firstName,
      lastName: createLeadDto.lastName,
      phone: createLeadDto.phone,
      source: createLeadDto.source || 'diagnosis',
      metadata: createLeadDto.metadata,
    });

    return {
      leadId: lead._id.toString(),
      email: lead.email,
      message: 'Lead creado exitosamente',
      existing: false,
    };
  }

  async submitDiagnosis(submitDiagnosisDto: SubmitDiagnosisDto) {
    // Find or create lead
    let lead = await this.leadModel.findOne({ 
      email: submitDiagnosisDto.email.toLowerCase() 
    }).exec();

    if (!lead) {
      // Create lead if doesn't exist
      lead = await this.leadModel.create({
        email: submitDiagnosisDto.email.toLowerCase(),
        firstName: submitDiagnosisDto.firstName,
        phone: submitDiagnosisDto.phone,
        source: 'diagnosis',
      });
    } else {
      // Update fields if not set
      if (submitDiagnosisDto.firstName && !lead.firstName) {
        lead.firstName = submitDiagnosisDto.firstName;
      }
      if (submitDiagnosisDto.phone && !lead.phone) {
        lead.phone = submitDiagnosisDto.phone;
      }
      await lead.save();
    }

    // Calculate diagnosis scores using AI
    const scores = await this.aiService.calculateDiagnosisScores(
      submitDiagnosisDto.diagnosisId || lead._id.toString(),
      submitDiagnosisDto.answers
    );

    // Recommend plan considering scores AND timeline (from answers)
    const recommendations = await this.aiService.recommendPlan(
      scores,
      submitDiagnosisDto.answers
    );

    // Update lead with diagnosis results
    lead.diagnosisAnswers = submitDiagnosisDto.answers;
    lead.diagnosisResults = {
      scores,
      recommendations,
      risks: [],
    };
    await lead.save();

    // Send email with results
    try {
      await this.emailService.sendDiagnosisResults(lead.email, {
        firstName: lead.firstName || lead.email.split('@')[0] || 'Estudiante',
        scores,
        recommendations,
      });

      lead.emailSent = true;
      lead.emailSentAt = new Date();
      await lead.save();
    } catch (error) {
      this.logger.error('Error sending email', 'LeadsService', error);
      // Don't fail the request if email fails
    }

    return {
      leadId: lead._id.toString(),
      email: lead.email,
      scores,
      recommendations,
      emailSent: lead.emailSent,
    };
  }
}
