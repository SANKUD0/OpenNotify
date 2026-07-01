import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { NotificationsService } from "../application/notifications.service";
import { NotificationChannelsService } from "../application/notification-channels.service";
import { CreateNotificationChannelDto } from "../application/dto/create-notification-channel.dto";

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly service: NotificationChannelsService){}

    @Post()
    createChannels(@Body() dto: CreateNotificationChannelDto) {
        return this.service.create(dto);
    }

    @Patch(':id')
    updateChannels(@Param('id') id: string, @Body() dto: CreateNotificationChannelDto) {
        return this.service.update(id, dto);
    }

    @Get(':id')
    getChannels(@Param('id') id: string) {
        return this.service.get(id);
    }

    @Delete(':id')
    deleteChannels(@Param('id') id: string) {
        return this.service.remove(id);
    }
} 