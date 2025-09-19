'use server';

import { prisma } from '@/db/prisma';
import { Resend } from 'resend';
import { randomBytes } from 'crypto';
import { formatError } from '../utils';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(formData: FormData) {
  try {
    const email = formData.get('email') as string;

    if (!email) {
      return { success: false, message: 'Email is required' };
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return { success: false, message: 'No account found with this email' };
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token to database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // Send email
    const resetUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${resetToken}`;
    
    await resend.emails.send({
      from: process.env.SENDER_EMAIL!,
      to: email,
      subject: 'Reset Your Password - ElliteStore',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p>You requested a password reset for your ElliteStore account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Reset Password
          </a>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    });

    return { success: true, message: 'Password reset email sent' };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, message: formatError(error) };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    if (!token || !newPassword) {
      return { success: false, message: 'Token and password are required' };
    }

    // Find user with valid token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return { success: false, message: 'Invalid or expired reset token' };
    }

    // Hash new password
    const { hashSync } = await import('bcrypt-ts-edge');
    const hashedPassword = hashSync(newPassword, 10);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}