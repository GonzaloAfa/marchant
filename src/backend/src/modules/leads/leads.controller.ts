import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto, SubmitDiagnosisDto } from './dto/lead.dto';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo lead (captura de email)' })
  @ApiResponse({ status: 201, description: 'Lead creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Email inválido o ya existe' })
  async createLead(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.createLead(createLeadDto);
  }

  @Post('diagnosis')
  @ApiOperation({ summary: 'Enviar diagnóstico completo' })
  @ApiResponse({ status: 200, description: 'Diagnóstico procesado y email enviado' })
  async submitDiagnosis(@Body() submitDiagnosisDto: SubmitDiagnosisDto) {
    return this.leadsService.submitDiagnosis(submitDiagnosisDto);
  }
}
