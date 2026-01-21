import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { getPlanName } from '../ai/plan.helper';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class EmailService {
  private fromEmail: string;
  private sesClient: SESClient | null = null;

  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
  ) {
    this.fromEmail = this.configService.get('FROM_EMAIL', 'noreply@marchant.com');
    
    // Initialize AWS SES if credentials are provided
    const awsRegion = this.configService.get('AWS_REGION', 'us-east-1');
    const awsAccessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
    const awsSecretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
    
    if (awsAccessKeyId && awsSecretAccessKey) {
      this.sesClient = new SESClient({
        region: awsRegion,
        credentials: {
          accessKeyId: awsAccessKeyId,
          secretAccessKey: awsSecretAccessKey,
        },
      });
    }
  }

  async sendDiagnosisResults(
    to: string,
    data: {
      firstName: string;
      scores: Record<string, number>;
      recommendations: any;
    }
  ) {
    const planName = getPlanName(data.recommendations.recommendedPlan);
    const overallScore = data.scores.overall || 0;

    // If AWS SES is not configured, log email content (for development)
    if (!this.sesClient) {
      const emailContent = [
        '\n📧 ============================================',
        '📧 EMAIL DE DIAGNÓSTICO (DESARROLLO)',
        '📧 ============================================',
        `📧 Para: ${to}`,
        '📧 Asunto: Tu Diagnóstico Personalizado - Método Marchant',
        '📧 ============================================',
        '\n📧 CONTENIDO DEL EMAIL:\n',
        `Hola ${data.firstName},`,
        '\nGracias por completar tu diagnóstico. Aquí están tus resultados personalizados:\n',
        '📊 TU SCORE GENERAL:',
        `   ${overallScore}/100\n`,
        '🎯 PLAN RECOMENDADO:',
        `   ${planName}`,
        `   ${data.recommendations.reason}\n`,
        '📈 SCORES POR PILAR:',
        ...Object.entries(data.scores)
          .filter(([key]) => key !== 'overall')
          .map(([key, value]) => `   ${this.getPillarName(key)}: ${value}/100`),
        '\n📧 ============================================',
        '📧 Link: Ver Plan Detallado',
        `📧 ${this.configService.get('FRONTEND_URL', 'http://localhost:3001')}/diagnostico?email=${encodeURIComponent(to)}`,
        '📧 ============================================\n',
      ];
      
      this.logger.logMultiline(emailContent, 'EmailService');
      
      return { success: true, message: 'Email logged (AWS SES not configured)' };
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Tu Diagnóstico - Método Marchant</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Método Marchant</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1976d2; margin-top: 0;">¡Hola ${data.firstName}!</h2>
            
            <p>Gracias por completar tu diagnóstico. Aquí están tus resultados personalizados:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1976d2;">
              <h3 style="margin-top: 0; color: #1976d2;">Tu Score General</h3>
              <div style="font-size: 48px; font-weight: bold; color: #1976d2; margin: 10px 0;">
                ${overallScore}/100
              </div>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1976d2;">Plan Recomendado</h3>
              <p style="font-size: 24px; font-weight: bold; color: #1976d2; margin: 10px 0;">
                ${planName}
              </p>
              <p style="color: #666;">${data.recommendations.reason}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1976d2;">Scores por Pilar</h3>
              <ul style="list-style: none; padding: 0;">
                ${Object.entries(data.scores)
                  .filter(([key]) => key !== 'overall')
                  .map(([key, value]) => `
                    <li style="padding: 10px 0; border-bottom: 1px solid #eee;">
                      <strong>${this.getPillarName(key)}:</strong> ${value}/100
                    </li>
                  `).join('')}
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get('FRONTEND_URL', 'http://localhost:3001')}/diagnostico?email=${encodeURIComponent(to)}" 
                 style="background: #1976d2; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Ver Plan Detallado
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Si tienes preguntas, responde a este email o contáctanos en hola@marchant.com
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>Método Marchant - Sistema Operativo para Producción de Capital Académico</p>
          </div>
        </body>
      </html>
    `;

    const params = {
      Source: this.fromEmail,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: 'Tu Diagnóstico Personalizado - Método Marchant',
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: html,
            Charset: 'UTF-8',
          },
          Text: {
            Data: this.getPlainTextVersion(data),
            Charset: 'UTF-8',
          },
        },
      },
    };

    try {
      const command = new SendEmailCommand(params);
      await this.sesClient.send(command);
      return { success: true, message: 'Email enviado exitosamente' };
    } catch (error) {
      this.logger.error('AWS SES error', 'EmailService', error);
      throw error;
    }
  }


  private getPillarName(key: string): string {
    const pillars: Record<string, string> = {
      viability: 'Viabilidad',
      structure: 'Estructuración',
      emotional: 'Estado Emocional',
      analysis: 'Análisis',
      shield: 'Blindaje',
      defense: 'Defensa',
    };
    return pillars[key] || key;
  }

  private getPlainTextVersion(data: any): string {
    return `
Método Marchant - Tu Diagnóstico Personalizado

Hola ${data.firstName},

Gracias por completar tu diagnóstico. Aquí están tus resultados:

Score General: ${data.scores.overall}/100
Plan Recomendado: ${getPlanName(data.recommendations.recommendedPlan)}
Razón: ${data.recommendations.reason}

Scores por Pilar:
${Object.entries(data.scores)
  .filter(([key]) => key !== 'overall')
  .map(([key, value]) => `- ${this.getPillarName(key)}: ${value}/100`)
  .join('\n')}

Visita nuestro sitio para ver más detalles sobre tu plan recomendado.

Saludos,
Equipo Método Marchant
    `.trim();
  }
}
