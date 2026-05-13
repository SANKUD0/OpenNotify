import { CheckStatus } from '@prisma/client';

/**
 * Résultat d'un check effectué sur un service.
 * C'est un Value Object : immuable, pas d'identité, juste des données.
 */
export interface CheckResult {
  status: CheckStatus;
  latencyMs: number;
  statusCode?: number;
  error?: string;
}

/**
 * Interface que TOUS les checkers doivent implémenter.
 * Permet le pattern Strategy : on peut substituer un checker par un autre
 * sans changer le code qui les utilise.
 */
export interface Checker {
  /**
   * Effectue un check sur une cible et retourne le résultat.
   * 
   * @param target - URL pour HTTP, host:port pour TCP, etc. selon l'implémentation
   * @param timeoutMs - temps max avant de considérer un timeout
   * @returns Le résultat du check (jamais throw, toujours un CheckResult)
   */
  check(target: string, timeoutMs: number): Promise<CheckResult>;
}