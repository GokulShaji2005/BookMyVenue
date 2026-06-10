import { Controller, HttpStatus, Post, UseGuards, Get, Body } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { HttpCode } from '@nestjs/common';
import { AdminVenueService } from './admin-venue.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CurrentUser, CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import { Param } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminVenueController {
    constructor(private readonly adminVenue: AdminVenueService) { }
    @Get('venues/pending')

    @Roles(UserRole.ADMIN)
    getPendingRequest(@CurrentUser() user: CurrentUserPayload) {
        return this.adminVenue.PendingVenues();
    }
    @Get('venues/:venueId')
    @Roles(UserRole.ADMIN)
    getPendingDetail(
        @Param('venueId', ParseUUIDPipe) venueId: string,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.adminVenue.PendingVenueDetails(venueId);
    }

    @Post('venues/:requestId/accept')
    @Roles(UserRole.ADMIN)
    AcceptVerification(@Param('requestId', ParseUUIDPipe) requesttId: string, @Body() reviewNotes: string,
        @CurrentUser() user: CurrentUserPayload,) {
        return this.adminVenue.AcceptVerification(requesttId, reviewNotes)
    }

}
