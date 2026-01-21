export type PlanId = 'seed' | 'growth' | 'flourishing' | 'mastery';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface PlanInfo {
  id: PlanId;
  name: string;
  price: number;
  description: string;
  features: string[];
}

export interface PlanRecommendation {
  plan: PlanId;
  reason: string;
  urgencyLevel: UrgencyLevel;
}

export const PLANS: Record<PlanId, PlanInfo> = {
  seed: {
    id: 'seed',
    name: 'Plan Semilla',
    price: 29,
    description: 'Comienza tu tesis con confianza y estructura',
    features: [
      'Diagnóstico inicial automatizado',
      'Biblioteca de recursos (plantillas, guías)',
      'Checkpoints mensuales automatizados',
      'Comunidad de apoyo básica',
      'Dashboard de progreso',
      'Recordatorios y motivación',
    ],
  },
  growth: {
    id: 'growth',
    name: 'Plan Crecimiento',
    price: 79,
    description: 'Avanza con acompañamiento personalizado',
    features: [
      'Todo lo de Semilla',
      '2 sesiones 1:1 con coach (30 min c/u)',
      'Revisión de estructura lógica',
      'Apoyo psicoemocional básico',
      'Feedback en tiempo real',
      'Prioridad en comunidad',
      'Acceso a webinars mensuales',
    ],
  },
  flourishing: {
    id: 'flourishing',
    name: 'Plan Florecimiento',
    price: 199,
    description: 'Completa tu tesis con excelencia académica',
    features: [
      'Todo lo de Crecimiento',
      '4 sesiones 1:1 premium (60 min c/u)',
      'Revisión completa de capítulos',
      'Blindaje académico (plagio, citación)',
      'Preparación para defensa oral',
      'Acceso prioritario a coaches',
      'Revisión de metodología',
      'Análisis crítico de resultados',
    ],
  },
  mastery: {
    id: 'mastery',
    name: 'Plan Maestría',
    price: 399,
    description: 'Experiencia premium con coach dedicado',
    features: [
      'Todo lo de Florecimiento',
      'Coach dedicado asignado',
      'Sesiones ilimitadas',
      'Revisión completa del documento',
      'Simulación de jurado (2 sesiones)',
      'Certificación del método',
      'Acceso a red de alumni',
      'Soporte 24/7',
    ],
  },
};

export const PLAN_RECOMMENDATIONS: Record<
  string,
  {
    plan: PlanId;
    reason: string;
    urgencyLevel: UrgencyLevel;
  }
> = {
  // Urgent (< 3 months)
  'urgent-low-score': {
    plan: 'mastery',
    reason: 'Con menos de 3 meses y un score bajo, necesitas apoyo intensivo y dedicado para completar tu tesis exitosamente',
    urgencyLevel: 'critical',
  },
  'urgent-normal-score': {
    plan: 'flourishing',
    reason: 'Con menos de 3 meses, necesitas apoyo integral y sesiones frecuentes para avanzar rápidamente',
    urgencyLevel: 'critical',
  },

  // High (3-6 months)
  'high-very-low-score': {
    plan: 'flourishing',
    reason: 'Con 3-6 meses y áreas que necesitan trabajo, el plan Florecimiento te dará el apoyo integral necesario',
    urgencyLevel: 'high',
  },
  'high-low-score': {
    plan: 'growth',
    reason: 'Con 3-6 meses, el acompañamiento personalizado del Plan Crecimiento te ayudará a avanzar de forma estructurada',
    urgencyLevel: 'high',
  },
  'high-normal-score': {
    plan: 'growth',
    reason: 'Aunque tienes buena base, con 3-6 meses el acompañamiento personalizado te asegurará cumplir tu meta',
    urgencyLevel: 'high',
  },

  // Medium (6 months - 1 year)
  'medium-low-score': {
    plan: 'growth',
    reason: 'Con 6 meses a 1 año, el Plan Crecimiento te dará el acompañamiento necesario para fortalecer áreas débiles',
    urgencyLevel: 'medium',
  },
  'medium-normal-score': {
    plan: 'seed',
    reason: 'Con 6 meses a 1 año, puedes avanzar con recursos automatizados y checkpoints del Plan Semilla',
    urgencyLevel: 'medium',
  },

  // Low (> 1 year)
  'low-any-score': {
    plan: 'seed',
    reason: 'Con más de 1 año, el Plan Semilla con recursos y checkpoints automatizados es perfecto para avanzar a tu ritmo',
    urgencyLevel: 'low',
  },

  // Fallback (no timeline)
  'fallback-very-low-score': {
    plan: 'flourishing',
    reason: 'Necesitas apoyo integral en múltiples áreas',
    urgencyLevel: 'high',
  },
  'fallback-low-score': {
    plan: 'growth',
    reason: 'Acompañamiento personalizado te ayudará a avanzar',
    urgencyLevel: 'medium',
  },
  'fallback-normal-score': {
    plan: 'seed',
    reason: 'Puedes avanzar con recursos y checkpoints automatizados',
    urgencyLevel: 'low',
  },
};

export function getPlanName(planId: PlanId): string {
  return PLANS[planId]?.name || planId;
}

export function getPlanInfo(planId: PlanId): PlanInfo {
  return PLANS[planId];
}
