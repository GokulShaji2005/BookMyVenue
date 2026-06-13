import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus, CancelledBy, PaymentStatus } from './entities/booking.entity';
import { CancelBookingDto, CreateBookingDto } from './dto/booking.dto';
import { Not } from 'typeorm';
import { Venue } from '../entities/venue.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
@Injectable()
export class BookingService {
    constructor(
        @InjectRepository(Booking)
        private readonly BookingRepo: Repository<Booking>,
        @InjectRepository(Venue)
        private readonly VenueRepo: Repository<Venue>
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



}
