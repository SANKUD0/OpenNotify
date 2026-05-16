import { Controller, Get } from "@nestjs/common";
import { IncidentsService } from "../application/incidents.service";

@Controller('incidents')
export class IncidentsController {
    constructor(private readonly incidentsService: IncidentsService) { }

    @Get()
    async getAllIncidents() {
        try {
            const incidents = await this.incidentsService.findAllIncidents();
            return incidents;
        } catch (error) {
            throw new Error(`Failed to fetch incidents: ${error}`);
        }
    }

    @Get('count/open')
    async getIncidentsCountOpen() {
        try {
            const count = await this.incidentsService.getIncidentsCountOpen();
            return { count };
        } catch (error) {
            throw new Error(`Failed to fetch incidents count: ${error}`);
        }
    }

}