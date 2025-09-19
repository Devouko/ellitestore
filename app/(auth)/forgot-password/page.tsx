import { Metadata } from 'next';
import ForgotPasswordForm from './forgot-password-form';

export const metadata: Metadata = {
  title: 'Forgot Password',
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Forgot Password</h2>
          <p className="mt-2 text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}