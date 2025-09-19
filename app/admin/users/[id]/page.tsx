import { Metadata } from 'next';
import { getUserById } from '@/lib/Actions/user.actions';
import { notFound } from 'next/navigation';
import UserEditForm from './user-edit-form';

export const metadata: Metadata = {
  title: 'Edit User',
};

export default async function EditUserPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit User</h1>
      <UserEditForm user={user} />
    </div>
  );
}