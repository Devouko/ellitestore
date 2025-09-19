import { Metadata } from 'next';
import ResetPasswordForm from './reset-password-form';

export const metadata: Metadata = {
  title: 'Reset Password',
};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Reset Password</h2>
          <p className="mt-2 text-gray-600">
            Enter your new password
          </p>
        </div>
        <ResetPasswordForm token={searchParams.token} />
      </div>
    </div>
  );
}