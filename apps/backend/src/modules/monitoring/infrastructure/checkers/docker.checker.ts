import { Injectable } from '@nestjs/common';
import Docker from 'dockerode';
import { Checker, CheckResult } from '../../domain/checker.interface';

@Injectable()
export class DockerChecker implements Checker {
  private readonly docker: Docker;

  constructor() {
    // dockerode détecte automatiquement la plateforme
    // Linux/Mac → /var/run/docker.sock
    // Windows → //./pipe/docker_engine
    this.docker = new Docker();
  }

  async check(target: string, timeoutMs: number): Promise<CheckResult> {
    const startTime = performance.now();

    try {
      // Récupérer le container par son nom (avec timeout)
      const container = this.docker.getContainer(target);
      
      const inspectPromise = container.inspect();
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Docker inspect timeout')), timeoutMs),
      );

      const info = await Promise.race([inspectPromise, timeoutPromise]);

      const latencyMs = Math.round(performance.now() - startTime);

      const state = info.State;
      const status = state.Status; // running, exited, paused, etc.
      const health = state.Health?.Status; // healthy, unhealthy, starting, none

      // Logique de décision
      if (status !== 'running') {
        return {
          status: 'DOWN',
          latencyMs,
          error: `Container status: ${status}`,
        };
      }

      // Si le container a un healthcheck Docker défini, on l'utilise
      if (health) {
        if (health === 'healthy') {
          return { status: 'UP', latencyMs };
        }
        if (health === 'starting') {
          // Container en démarrage : on considère DOWN temporairement
          return {
            status: 'DOWN',
            latencyMs,
            error: 'Container starting up',
          };
        }
        return {
          status: 'DOWN',
          latencyMs,
          error: `Container unhealthy: ${health}`,
        };
      }

      // Pas de healthcheck défini, mais le container tourne
      return { status: 'UP', latencyMs };

    } catch (error) {
      const latencyMs = Math.round(performance.now() - startTime);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Détecter le timeout
      const isTimeout = errorMessage.includes('timeout');

      // Détecter "container not found"
      const isNotFound = errorMessage.includes('No such container') ||
                         errorMessage.includes('not found');

      return {
        status: isTimeout ? 'TIMEOUT' : 'DOWN',
        latencyMs,
        error: isNotFound ? `Container "${target}" not found` : errorMessage,
      };
    }
  }
}