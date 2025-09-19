import { Metadata } from 'next';
import CurrencySettings from './currency-settings';

export const metadata: Metadata = {
  title: 'Admin Settings - ElliteStore',
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Settings</h1>
      <CurrencySettings />
    </div>
  );
}