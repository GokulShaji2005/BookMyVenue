import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue } from '../entities/venue.entity';
import { VenueType } from 'src/common/enums/venue-type.enum';
import { VenueStatus } from 'src/common/enums/venue-status.enum';
import { NotFoundException } from '@nestjs/common';
import { VenueVerificationRequest } from '../entities/venue-verification-request.entity';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';
@Injectable()
export class AdminVenueService {
   constructor(
      @InjectRepository(Venue)
      private readonly venueRepo: Repository<Venue>,
      @InjectRepository(VenueVerificationRequest)
      private readonly venueVerificationRepo: Repository<VenueVerificationRequest>
   ) { }

   async PendingVenues(): Promise<Venue[]> {
      const pending = await this.venueRepo.find({
         where: {

            status: VenueStatus.PENDING_REVIEW
         }
      })

      if (pending.length === 0) {
         throw new NotFoundException('Pending verifications is not found');
      }
      return pending
   }

   async PendingVenueDetails(venueId: string): Promise<Venue> {
      const pendingDetails = await this.venueRepo.findOne({
         where: {
            id: venueId,
            status: VenueStatus.PENDING_REVIEW
         },
         relations: [
            'images',
            'documents',

         ],
      })

      if (!pendingDetails) {
         throw new NotFoundException("Venue Details Not Found")
      }
      return pendingDetails;
   }

   async AcceptVerification(requestId: string, review_notes: string): Promise<{
      message: string, status: string, review_notes: string
   }> {

      const request = await this.venueVerificationRepo.findOne({
         where: {
            id: requestId
         }
      })

      if (!request) {
         throw new NotFoundException("Request is not found");
      }

      if (request.status != VerificationStatus.PENDING) {
         throw new BadRequestException(
            'This request has already been reviewed.',
         );
      }
      request.status = VerificationStatus.APPROVED;
      request.reviewNotes = review_notes
      const venue = await this.venueRepo.findOne({
         where: {
            id: request.venueId
         }
      })
      if (!venue) {
         throw new NotFoundException('Venue not found');
      }
      venue.status = VenueStatus.APPROVED

      await this.venueVerificationRepo.save(request)
      await this.venueRepo.save(venue);
      return {
         message: `Venue ${venue.venueName} has been verified successfully.`,
         status: venue.status,
         review_notes: request.reviewNotes
      }
   }

   async RejectVerification(requestId: string, review_notes: string): Promise<{
      message: string, status: string, review_notes: string
   }> {

      const request = await this.venueVerificationRepo.findOne({
         where: {
            id: requestId
         }
      })

      if (!request) {
         throw new NotFoundException("Request is not found");
      }
      if (request.status != VerificationStatus.PENDING) {
         throw new BadRequestException('This request has already been reviewed.');
      }

      request.status = VerificationStatus.REJECTED;
      request.reviewNotes = review_notes
      const venue = await this.venueRepo.findOne({
         where: {
            id: request.venueId
         }
      })
      if (!venue) {
         throw new NotFoundException('Venue not found');
      }
      venue.status = VenueStatus.REJECTED

      await this.venueVerificationRepo.save(request)
      await this.venueRepo.save(venue);

      return {
         message: `Venue ${venue.venueName} has been Rejected.`,
         status: venue.status,
         review_notes: request.reviewNotes
      }
   }




}
