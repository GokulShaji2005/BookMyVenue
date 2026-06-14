import { IsString, IsNotEmpty, IsOptional, Matches, MaxLength } from 'class-validator';

export class CreateVenueBlockedDateRangeDto {
  @IsString({ message: 'startDate must be a string' })
  @IsNotEmpty({ message: 'startDate is required' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate must be in YYYY-MM-DD format (e.g. 2026-06-20)',
  })
  startDate: string;

  @IsString({ message: 'endDate must be a string' })
  @IsNotEmpty({ message: 'endDate is required' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'endDate must be in YYYY-MM-DD format (e.g. 2026-06-20)',
  })
  endDate: string;

  @IsOptional()
  @IsString({ message: 'reason must be a string' })
  @MaxLength(255, { message: 'reason cannot exceed 255 characters' })
  reason?: string;
}
