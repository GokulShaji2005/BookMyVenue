import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Between } from 'typeorm';
import { Booking, BookingStatus, CancelledBy, PaymentStatus } from './entities/booking.entity';
import { CancelBookingDto, CreateBookingDto } from './dto/booking.dto';
import { Venue } from '../entities/venue.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { VenueBlockedDate } from './entities/venue-blocked-date.entity';
import { CreateVenueBlockedDateRangeDto } from './dto/venue-block.dto';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class BookingService {
    constructor(
        @InjectRepository(Booking)
        private readonly BookingRepo: Repository<Booking>,
        @InjectRepository(Venue)
        private readonly VenueRepo: Repository<Venue>,
        @InjectRepository(VenueBlockedDate)
        private readonly VenueBlockedRepo: Repository<VenueBlockedDate>


    ) { }

    async createBooking(dto: CreateBookingDto, customerId: string): Promise<Booking> {
        const { venueId, bookingDate, specialRequest } = dto;

        const venue = await this.VenueRepo.findOne({
            where: {
                id: venueId
            }
        })
        if (!venue) {
            throw new NotFoundException("The venue is not found")
        }
        const existingBooking = await this.BookingRepo.find({
            where: {
                venueId: venueId,
                bookingDate: bookingDate,
                bookingStatus: Not(BookingStatus.CANCELLED)
            }
        })

        if (existingBooking) {
            throw new ConflictException("The venue is already booked for selected Date");
        }
        const bookingReference = `BMV-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        const price = Number(venue.startingPrice);

        const newBooking = await this.BookingRepo.create({
            bookingReference,
            customerId, venueId,
            bookingDate,
            specialRequest,
            bookingStatus: BookingStatus.CONFIRMED,
            paymentStatus: PaymentStatus.PAID,
            baseAmount: price,
            totalAmount: price,
        })

        return await this.BookingRepo.save(newBooking);
    }

    async cancelBooking(dto: CancelBookingDto, bookingId: string, UserId: string, userRole: UserRole): Promise<Booking> {
        const { cancellationReason } = dto;

        const booking = await this.BookingRepo.findOne({
            where: {
                bookingId: bookingId
            }
        })
        if (!booking) {
            throw new NotFoundException("The venue is not booked")
        }
        if (booking.bookingStatus === BookingStatus.CANCELLED) {
            throw new BadRequestException("This booking has already been cancelled.");
        }
        if (userRole === UserRole.CUSTOMER) {
            if (booking.customerId != UserId) {
                throw new ForbiddenException("You are not authorized to cancel this booking.");
            }
            booking.cancelledBy = CancelledBy.CUSTOMER;

        }
        else if (userRole === UserRole.VENUE_OWNER) {
            const venue = await this.VenueRepo.findOne({
                where: {
                    id: booking.venueId
                }
            })

            if (!venue || venue.ownerId !== UserId) {
                throw new ForbiddenException("You are not authorized to cancel bookings for this venue.");
            }
            booking.cancelledBy = CancelledBy.OWNER
        }
        else if (userRole === UserRole.ADMIN) {
            booking.cancelledBy = CancelledBy.ADMIN;
        }


        booking.bookingStatus = BookingStatus.CANCELLED;
        booking.paymentStatus = PaymentStatus.REFUNDED;
        booking.cancellationReason = cancellationReason;
        booking.cancelledAt = new Date();
        booking.refundAmount = Number(booking.totalAmount); // Fully refund the amount
        // 5. Save the updated entity
        return await this.BookingRepo.save(booking);
    }

    async venueBlocking(
        dto: CreateVenueBlockedDateRangeDto,
        userId: string,
        userRole: UserRole,
        venueId: string,
    ): Promise<VenueBlockedDate> {
        const { startDate, endDate, reason } = dto;

        // 1. Fetch and validate venue
        const venue = await this.VenueRepo.findOne({
            where: { id: venueId },
        });

        if (!venue) {
            throw new NotFoundException('The venue is not found');
        }

        // 2. Authorization check
        if (venue.ownerId !== userId) {
            throw new ForbiddenException('You are not authorized to block the venue.');
        }

        // 3. Date Validations
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Prevent submitting an endDate before the startDate
        if (end < start) {
            throw new BadRequestException('End date cannot be before start date.');
        }

        // startDate should be atleast one day before the current date (yesterday or later)
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (start < yesterday) {
            throw new BadRequestException('Start date cannot be older than yesterday.');
        }

        // 4. Check for conflicting active bookings within this range
        const conflictingBooking = await this.BookingRepo.findOne({
            where: {
                venueId,
                bookingStatus: Not(BookingStatus.CANCELLED),
                bookingDate: Between(startDate, endDate),
            },
        });

        if (conflictingBooking) {
            throw new ConflictException(
                `Cannot block this range. There is already an active booking on ${conflictingBooking.bookingDate}.`
            );
        }

        // 5. Create and save the block range
        const blockedRange = this.VenueBlockedRepo.create({
            venueId,
            startDate,
            endDate,
            reason: reason || null,
        });

        return await this.VenueBlockedRepo.save(blockedRange);
    }

    async
}


