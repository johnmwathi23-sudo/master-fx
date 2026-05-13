import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { KycService } from './kyc.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IsString, IsOptional, IsEnum } from 'class-validator';

class SubmitKycDto {
  @IsString()
  documentType: string;

  @IsString()
  documentUrl: string;

  @IsOptional()
  @IsString()
  selfieUrl?: string;

  @IsOptional()
  @IsString()
  addressProofUrl?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;
}

@Controller('kyc')
export class KycController {
  constructor(private kycService: KycService) {}

  @Post('submit')
  @UseGuards(JwtAuthGuard)
  async submitKyc(@CurrentUser() user: any, @Body() dto: SubmitKycDto) {
    return this.kycService.submitKyc(user.sub, dto);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getKycStatus(@CurrentUser() user: any) {
    return this.kycService.getKycStatus(user.sub);
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard)
  async getPendingSubmissions(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.kycService.getPendingSubmissions(parseInt(page), parseInt(limit));
  }

  @Put(':id/review')
  @UseGuards(JwtAuthGuard)
  async reviewKyc(
    @CurrentUser() user: any,
    @Param('id') kycId: string,
    @Body('status') status: 'APPROVED' | 'REJECTED',
    @Body('note') note?: string,
  ) {
    return this.kycService.reviewKyc(user.sub, kycId, status, note);
  }
}
