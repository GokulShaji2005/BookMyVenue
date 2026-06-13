import { IsUUID, IsString, IsNotEmpty, IsOptional, Matches, MaxLength, IsEnum } from 'class-validator';
import { BookingStatus, PaymentStatus } from '../entities/booking.entity';



export class CreateBookingDto {
    @IsUUID('4', { message: 'venueId must be a valid UUID' })
    @IsNotEmpty({ message: 'venueId is required' })
    venueId: string;

    @IsString({ message: 'bookingDate must be a string' })
    @IsNotEmpty({ message: 'bookingDate is required' })
    // Enforces 'YYYY-MM-DD' format
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'bookingDate must be in YYYY-MM-DD format',
    })
    bookingDate: string;

    @IsOptional()
    @IsString({ message: 'specialRequest must be a string' })
    @MaxLength(1000, { message: 'specialRequest cannot exceed 1000 characters' })
    specialRequest?: string;
}

export class CancelBookingDto {
    @IsString({ message: 'cancellationReason must be a string' })
    @IsNotEmpty({ message: 'cancellationReason is required' })
    @MaxLength(500, { message: 'cancellationReason cannot exceed 500 characters' })
    cancellationReason: string;
}


export class UpdateBookingStatusDto {
    @IsOptional()
    @IsEnum(BookingStatus, {
        message: `bookingStatus must be one of: ${Object.values(BookingStatus).join(', ')}`,
    })
    bookingStatus?: BookingStatus;
    @IsOptional()
    @IsEnum(PaymentStatus, {
        message: `paymentStatus must be one of: ${Object.values(PaymentStatus).join(', ')}`,
    })
    paymentStatus?: PaymentStatus;
}