import { Module } from '@nestjs/common';
import { AdminVenueController } from './admin-venue.controller';
import { AdminVenueService } from './admin-venue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Venue } from '../entities/venue.entity';
import { VenueVerificationRequest } from '../entities/venue-verification-request.entity';
@Module({
  imports: [
    ConfigModule, TypeOrmModule.forFeature([
      Venue,
      VenueVerificationRequest,
    ]),
  ],
  controllers: [AdminVenueController],
  providers: [AdminVenueService]
})
export class AdminVenueModule { }
