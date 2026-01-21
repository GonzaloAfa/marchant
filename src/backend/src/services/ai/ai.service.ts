import { Injectable } from '@nestjs/common';
import { PlanRecommendation, PLAN_RECOMMENDATIONS } from './plan.helper';

@Injectable()
export class AIService {
  constructor() {}

  async calculateDiagnosisScores(diagnosisId: string, answers?: Record<string, any>) {
    if (!answers || Object.keys(answers).length === 0) {
      // Default scores if no answers
      return {
        viability: 50,
        structure: 50,
        emotional: 50,
        overall: 50,
      };
    }

    // Extract answers and calculate scores based on responses
    const scores: Record<string, number> = {
      viability: 50,
      structure: 50,
      emotional: 50,
      analysis: 50,
      shield: 50,
      defense: 50,
    };

    // Score based on answers
    Object.entries(answers).forEach(([questionId, answer]) => {
      const id = Number.parseInt(questionId, 10);
      const answerStr = String(answer).toLowerCase();

      // Question 1: Timeline (critical for plan recommendation)
      if (id === 1) {
        // Timeline is stored separately, not scored here
        return;
      }

      // Question 2: Viability (access to sources)
      if (id === 2) {
        if (answerStr.includes('sí') || answerStr.includes('completo')) {
          scores.viability = 85;
        } else if (answerStr.includes('parcial')) {
          scores.viability = 60;
        } else {
          scores.viability = 30;
        }
      }

      // Question 3: Structure (problem definition)
      if (id === 3) {
        if (answerStr.includes('muy claro') || answerStr.includes('sí')) {
          scores.structure = 85;
        } else if (answerStr.includes('parcial')) {
          scores.structure = 60;
        } else {
          scores.structure = 30;
        }
      }

      // Question 4: Emotional state
      if (id === 4) {
        if (answerStr.includes('confianza')) {
          scores.emotional = 85;
        } else if (answerStr.includes('moderada')) {
          scores.emotional = 60;
        } else if (answerStr.includes('alta') || answerStr.includes('bloqueo')) {
          scores.emotional = 25;
        }
      }
    });

    // Calculate overall score (average of all pillars)
    const pillarScores = Object.values(scores).filter(v => typeof v === 'number');
    const overall = Math.round(
      pillarScores.reduce((sum, score) => sum + score, 0) / pillarScores.length
    );

    return {
      ...scores,
      overall,
    };
  }

  async recommendPlan(scores: any, answers?: Record<string, any>) {
    const overallScore = scores.overall || 0;
    const timeRemaining = this.extractTimeline(answers);

    const recommendation = timeRemaining
      ? this.recommendByTimeline(timeRemaining, overallScore)
      : this.recommendByScore(overallScore);

    const estimatedMonths = this.calculateEstimatedMonths(timeRemaining, overallScore);

    return {
      recommendedPlan: recommendation.plan,
      confidence: timeRemaining ? 0.92 : 0.75,
      reason: recommendation.reason,
      estimatedMonths,
      urgencyLevel: recommendation.urgencyLevel,
      timelineConsidered: !!timeRemaining,
    };
  }

  private extractTimeline(answers?: Record<string, any>): string | null {
    if (!answers) return null;
    const timelineAnswer = answers['1'] || answers[1];
    return timelineAnswer ? String(timelineAnswer).toLowerCase() : null;
  }

  private recommendByTimeline(
    timeRemaining: string,
    overallScore: number,
  ): PlanRecommendation {
    if (this.isLessThan3Months(timeRemaining)) {
      return this.recommendForUrgent(overallScore);
    }
    if (this.is3To6Months(timeRemaining)) {
      return this.recommendFor3To6Months(overallScore);
    }
    if (this.is6MonthsTo1Year(timeRemaining)) {
      return this.recommendFor6MonthsTo1Year(overallScore);
    }
    if (this.isMoreThan1Year(timeRemaining)) {
      return PLAN_RECOMMENDATIONS['low-any-score'];
    }
    return this.recommendByScore(overallScore);
  }

  private isLessThan3Months(timeRemaining: string): boolean {
    return timeRemaining.includes('menos de 3') || timeRemaining.includes('menos de 3 meses');
  }

  private is3To6Months(timeRemaining: string): boolean {
    return (
      timeRemaining.includes('3 a 6') ||
      timeRemaining.includes('3-6') ||
      timeRemaining.includes('3 meses')
    );
  }

  private is6MonthsTo1Year(timeRemaining: string): boolean {
    return (
      timeRemaining.includes('6 meses a 1 año') ||
      timeRemaining.includes('6 meses') ||
      timeRemaining.includes('6-12')
    );
  }

  private isMoreThan1Year(timeRemaining: string): boolean {
    return timeRemaining.includes('más de 1 año') || timeRemaining.includes('1 año');
  }

  private recommendForUrgent(overallScore: number): PlanRecommendation {
    const key = overallScore < 60 ? 'urgent-low-score' : 'urgent-normal-score';
    return PLAN_RECOMMENDATIONS[key];
  }

  private recommendFor3To6Months(overallScore: number): PlanRecommendation {
    if (overallScore < 50) {
      return PLAN_RECOMMENDATIONS['high-very-low-score'];
    }
    const key = overallScore < 70 ? 'high-low-score' : 'high-normal-score';
    return PLAN_RECOMMENDATIONS[key];
  }

  private recommendFor6MonthsTo1Year(overallScore: number): PlanRecommendation {
    const key = overallScore < 50 ? 'medium-low-score' : 'medium-normal-score';
    return PLAN_RECOMMENDATIONS[key];
  }

  private recommendByScore(overallScore: number): PlanRecommendation {
    if (overallScore < 50) {
      return PLAN_RECOMMENDATIONS['fallback-very-low-score'];
    }
    if (overallScore < 70) {
      return PLAN_RECOMMENDATIONS['fallback-low-score'];
    }
    return PLAN_RECOMMENDATIONS['fallback-normal-score'];
  }

  private calculateEstimatedMonths(timeRemaining: string | null, overallScore: number): number {
    if (!timeRemaining) {
      return Math.ceil((100 - overallScore) / 10);
    }
    if (timeRemaining.includes('menos de 3')) return 2;
    if (timeRemaining.includes('3 a 6') || timeRemaining.includes('3-6')) return 4;
    if (timeRemaining.includes('6 meses a 1 año')) return 8;
    if (timeRemaining.includes('más de 1 año')) return 12;
    return Math.ceil((100 - overallScore) / 10);
  }
}
