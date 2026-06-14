import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser, CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { BookingService } from './booking.service';
import { CreateBookingDto, CancelBookingDto } from './dto/booking.dto';
import { CreateVenueBlockedDateRangeDto } from './dto/venue-block.dto';

@Controller('booking')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingController {
    constructor(private readonly bookingService: BookingService) { }

    // ─── Create Booking ────────────────────────────────────────────────────────

    /**
     * POST /booking
     * Customer creates a new booking for a venue on a specific date.
     * Only customers are allowed to call this endpoint.
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(UserRole.CUSTOMER)
    createBooking(
        @Body() dto: CreateBookingDto,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.bookingService.createBooking(dto, user.sub);
    }

    // ─── Cancel Booking ────────────────────────────────────────────────────────

    /**
     * PATCH /booking/:bookingId/cancel
     * Cancel an existing booking.
     * - Customer can only cancel their own booking.
     * - Venue owner can cancel bookings on their venue.
     * - Admin can cancel any booking.
     */
    @Patch(':bookingId/cancel')
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.CUSTOMER, UserRole.VENUE_OWNER, UserRole.ADMIN)
    cancelBooking(
        @Param('bookingId', ParseUUIDPipe) bookingId: string,
        @Body() dto: CancelBookingDto,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.bookingService.cancelBooking(dto, bookingId, user.sub, user.role);
    }

    // ─── Block Venue Dates ─────────────────────────────────────────────────────

    /**
     * POST /booking/venues/:venueId/block
     * Venue owner blocks a date range on their venue.
     * Only the owner of that specific venue can call this.
     */
    @Post('venues/:venueId/block')
    @HttpCode(HttpStatus.CREATED)
    @Roles(UserRole.VENUE_OWNER)
    blockVenueDates(
        @Param('venueId', ParseUUIDPipe) venueId: string,
        @Body() dto: CreateVenueBlockedDateRangeDto,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.bookingService.venueBlocking(dto, user.sub, user.role, venueId);
    }
}
