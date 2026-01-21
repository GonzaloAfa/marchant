import { IsEmail, IsString, IsOptional, IsObject, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeadDto {
  @ApiProperty({ description: 'Email del lead', example: 'estudiante@example.com' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ description: 'Nombre', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Apellido', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'Teléfono', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Fuente del lead', enum: ['diagnosis', 'newsletter', 'contact'], default: 'diagnosis' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiProperty({ description: 'Metadata adicional', required: false })
  @IsOptional()
  @IsObject()
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
}

export class SubmitDiagnosisDto {
  @ApiProperty({ description: 'Email del lead' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ description: 'Nombre del lead', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Teléfono del lead (WhatsApp)', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Respuestas del diagnóstico' })
  @IsObject()
  answers: Record<string, any>;

  @ApiProperty({ description: 'ID del diagnóstico (opcional)', required: false })
  @IsOptional()
  @IsString()
  diagnosisId?: string;
}
