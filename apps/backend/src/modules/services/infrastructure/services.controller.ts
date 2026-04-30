import { Body, Controller, Delete, Get, Post, Put, Res, HttpException, HttpStatus } from '@nestjs/common';
import { ServicesService } from '../applications/services.service';
import { CreateServiceDto } from '../applications/dto/create-services.dto';
import { UpdateServiceDto } from '../applications/dto/update-services.dto';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {}

    @Get()
    findAll() {
        return this.servicesService.findAll();
    }

    @Post()
    create(@Body() dto: CreateServiceDto) {
        return this.servicesService.insertNewService(dto)
    }

    @Delete()
    delete(@Body() id: string) {
        return this.servicesService.deleteService(id);
    }

    @Put()
    updateService(@Body() dto: UpdateServiceDto) {
        try {
            if (!dto) throw new HttpException('Invalid request body', HttpStatus.BAD_REQUEST);
            return this.servicesService.updateService(dto);
        } catch (error) {
            throw new HttpException("Internal server error for updating service", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
