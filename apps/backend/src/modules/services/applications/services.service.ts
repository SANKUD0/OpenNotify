import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { CreateServiceDto } from './dto/create-services.dto';
import { UpdateServiceDto } from './dto/update-services.dto';

@Injectable()
export class ServicesService {
    constructor(private readonly prisma: PrismaService) { }

    findAll() {
        return this.prisma.service.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    insertNewService(dto: CreateServiceDto) {
        try {
            return this.prisma.service.create({
                data: dto
            });
        } catch (error) {
            console.log('Error inserting new service:', error);
            return { message: 'Error inserting new service' };
        }
    }


    deleteService(id: string) {
        try {
            return this.prisma.service.delete({
                where: { id }
            });
        } catch (error) {
            console.log('Error deleting service:', error);
            return { message: 'Error deleting service' };
        }
    }

    updateService(dto: UpdateServiceDto) {
        try {
            if (!dto.id) throw new Error('Service ID is required for update');
            return this.prisma.service.update({
                where: { id: dto.id },
                data: dto
            });
        } catch (error) {
            console.log('Error updating service:', error);
            return { message: 'Error updating service' };
        }
    }
}
