import {
    Body,
    Controller,
    Get,
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

@Controller('booking')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingController {
    constructor(private readonly bookingService: BookingService) { }

    // ─── Create Booking ────────────────────────────────────────────────────────

    /**
     * POST /booking
     * Customer creates a new booking for a venue on a specific date.
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

    // ─── List My Bookings ──────────────────────────────────────────────────────

    /**
     * GET /booking/my
     * Customer retrieves their own booking history.
     */
    @Get('my')
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.CUSTOMER)
    getMyBookings(@CurrentUser() user: CurrentUserPayload) {
        return this.bookingService.getCustomerBookings(user.sub);
    }

    // ─── Cancel Booking ────────────────────────────────────────────────────────

    /**
     * PATCH /booking/:bookingId/cancel
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
}
