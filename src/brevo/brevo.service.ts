import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { EncryptionService } from '../common/services/encryption.service';

interface EmailResponse {
  name: string;
  id: number;
}

export interface ResetPasswordTokenPayload {
  email: string;
  is_active: boolean;
  exp: number;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly apiKey = process.env.BREVO_API_KEY;
  private readonly baseUrl = 'https://api.brevo.com/v3';

  constructor(
    private readonly http: HttpService,
    private encryptionService: EncryptionService,
  ) {}

  /**
   * Send a transactional email to a single recipient
   */
  async sendTransactionalEmail(options: {
    to: string;
    subject: string;
    htmlContent: string;
    sender?: { name: string; email: string };
  }) {
    const payload = {
      sender: options.sender || {
        name: process.env.MAIL_FROM_NAME || 'Queue System',
        email: process.env.MAIL_FROM || 'braditya12@gmail.com',
      },
      to: [{ email: options.to }],
      subject: options.subject,
      htmlContent: options.htmlContent,
    };
    try {
      const response$ = this.http.post<EmailResponse>(
        `${this.baseUrl}/smtp/email`,
        payload,
        {
          headers: {
            'api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
        },
      );

      const { data } = await lastValueFrom(response$);
      this.logger.log(`📧 Transactional email sent to ${options.to}`);
      return data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      const msg = error?.response?.data || error.message;
      this.logger.error(`❌ Failed to send email: ${msg}`);
      throw error;
    }
  }

  /**
   * Create a scheduled or immediate campaign
   */
  async createEmailCampaign(options: {
    name: string;
    subject: string;
    sender: { name: string; email: string };
    htmlContent: string;
    listIds: number[];
    scheduledAt?: string;
  }) {
    const payload = {
      name: options.name,
      subject: options.subject,
      sender: options.sender,
      type: 'classic',
      htmlContent: options.htmlContent,
      recipients: { listIds: options.listIds },
      scheduledAt: options.scheduledAt || new Date().toISOString(),
    };

    try {
      const response$ = this.http.post<EmailResponse>(
        `${this.baseUrl}/emailCampaigns`,
        payload,
        {
          headers: {
            'api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
        },
      );

      const { data } = await lastValueFrom(response$);
      this.logger.log(`✅ Campaign created: ${data.name || data.id}`);
      return data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      const msg = error?.response?.data || error.message;
      this.logger.error(`❌ Failed to create campaign: ${msg}`);
      throw error;
    }
  }

  async sendCompanyRegisterEmail(options: { to: string; companyName: string }) {
    const expireAt = Date.now() + 24 * 60 * 60 * 1000; // 1 day in ms
    const payload: ResetPasswordTokenPayload = {
      email: options.to,
      is_active: true,
      exp: expireAt,
    };

    // Encrypt the payload
    const token = this.encryptionService.encrypt(payload);
    const resetPasswordUrl = `${process.env.FRONT_END_URL}/set-password?token=${token}`;
    const subject = `🎉 Welcome to Queue System, ${options.companyName}!`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Hi ${options.companyName},</h2>
        <p>Thank you for registering your company on <strong>Queue System</strong>!</p>
        <p>Your account has been successfully created, and you're one step away from managing your queues more efficiently.</p>
        <p style="margin-top: 20px;">
          To secure your account, please set your password by clicking the button below:
        </p>
        <p style="margin: 30px 0;">
          <a href="${resetPasswordUrl}"
             style="background: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px;">
             Set Your Password
          </a>
        </p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 13px; color: #888;">© ${new Date().getFullYear()} Queue System. All rights reserved.</p>
      </div>
    `;

    return this.sendTransactionalEmail({
      to: options.to,
      subject,
      htmlContent,
    });
  }
}
