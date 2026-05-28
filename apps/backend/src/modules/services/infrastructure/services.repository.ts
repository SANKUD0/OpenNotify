import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/database/prisma.service";
import { CreateServiceDto } from "../applications/dto/create-services.dto";
import { UpdateServiceDto } from "../applications/dto/update-services.dto";

@Injectable()
export class ServicesRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return await this.prisma.service.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async insertNewService(dto: CreateServiceDto) {
        try {
            return await this.prisma.service.create({
                data: dto
            });
        } catch (error) {
            console.log('Erreur lors de la création du service ', error);
            return { message: 'Erreur lors de la création du service' };
        }
    }

    async deleteService(id: string) {
        try {
            return await this.prisma.service.delete({
                where: { id: id }
            });
        } catch (error) {
            console.log('Erreur lors de la suppression du service:', error);
            return { message: 'Erreur lors de la suppression du service' };
        }
    }

    async updateService(dto: UpdateServiceDto, id: string) {
        try {
            if (!id) throw new Error('Service ID is required for update');
            return await this.prisma.service.update({
                where: { id },
                data: dto
            });
        } catch (error) {
            console.log('Erreur lors de la mise à jour du service:', error);
            return { message: 'Erreur lors de la mise à jour du service' };
        }
    }

    async getServiceById(id: string) {
        return await this.prisma.service.findUnique({
            where: { id }
        });
    }

    async getChecksById(id: string) {
        return await this.prisma.check.findMany({
            where: { serviceId: id }
        });
    }

    async getIncidentsById(id: string) {
        return this.prisma.incident.findMany({
            where: { serviceId: id }
        });
    }

    async getCount() {
        try {
            return await this.prisma.service.count();
        } catch (error) {
            console.log('Erreur lors de la récupération du nombre de services:', error);
            return null;
        }
    }

    async getUpServices() {
        return await this.prisma.serviceState.count({
            where: { status: 'UP' },
        });
    }

    async getDownServices() {
        return await this.prisma.serviceState.count({
            where: { status: 'DOWN' },
        });
    }

    async getServiceCardsInfo() {
        return await this.prisma.serviceState.findMany({
            select: {
                status: true,
                latencyMs: true,
                service: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        intervalSeconds: true,
                        timeoutMs: true,
                        failureThreshold: true,
                        enabled: true,
                    }
                }
            }
        });
    }
    /**
     * Allows to enable or disable a service by updating its 'enabled' field in the database. This method is useful for controlling whether a service should be monitored or not without deleting it from the system.
     * @param id The unique identifier of the service to be updated.
     * @param enabled A boolean value indicating whether the service should be enabled (true) or disabled (false).
     * @return The updated service object if the operation is successful, or an error message if there is an issue during the update process.
     */
    async patchServiceEnabled(id: string, enabled: boolean) {
        try {
            return await this.prisma.service.update({
                where: { id },
                data: { enabled }
            });
        } catch (error) {
            console.log('Erreur lors de la mise à jour du statut du service:', error);
            return { message: 'Erreur lors de la mise à jour du statut du service' };
        }
    }
}