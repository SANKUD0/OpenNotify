import { Injectable } from "@nestjs/common";
import { Checker, CheckResult } from "../../domain/checker.interface";
import { request } from 'undici';

@Injectable()
export class HttpChecker implements Checker {
    async check(target: string, timeoutMs: number): Promise<CheckResult> {
        const startTime = performance.now();
        try {
            const response = await request(target, {
                method: 'GET',
                headersTimeout: timeoutMs,
                bodyTimeout: timeoutMs,
                // On ne suit pas les redirects pour mesurer vraiment ce qui répond
                //maxRedirections: 0 
            });
            const latencyMs = Math.round(performance.now() - startTime);
            const statusCode = response.statusCode;
            // Important : consommer le body pour libérer la connexion
            // (sinon undici garde la connexion ouverte)
            await response.body.dump();
            // 2xx et 3xx = service up
            // 4xx et 5xx = service répond mais erreur
            const isHealthy = statusCode >= 200 && statusCode < 400;

            return {
                status: isHealthy ? 'UP' : 'DOWN',
                latencyMs,
                statusCode,
                error: isHealthy ? undefined : `HTTP ${statusCode}`,
            };

        } catch (error) {
            const latencyMs = Math.round(performance.now() - startTime);
            // Détection des timeouts (undici code)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const isTimeOut = errorMessage.includes('timeout') ||
                errorMessage.includes('UND_ERR_HEADERS_TIMEOUT') ||
                errorMessage.includes('UND_ERR_BODY_TIMEOUT');
            return {
                status: isTimeOut ? 'TIMEOUT' : 'DOWN',
                latencyMs,
                error: errorMessage
            }
        }
    }



}
