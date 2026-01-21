import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Método Marchant API - Sistema Operativo para Producción de Capital Académico';
  }
}
