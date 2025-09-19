'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { updateUserRole } from '@/lib/Actions/user.actions';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UserEditForm({ user }: { user: User }) {
  const [role, setRole] = useState(user.role);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleRoleUpdate = async () => {
    setIsUpdating(true);
    try {
      const result = await updateUserRole(user.id, role);
      toast({
        title: result.success ? 'Success' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <p className="text-lg">{user.name}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium">Email</label>
          <p className="text-lg">{user.email}</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="seller">Seller</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleRoleUpdate} 
          disabled={isUpdating || role === user.role}
        >
          {isUpdating ? 'Updating...' : 'Update Role'}
        </Button>
        
        {role === 'seller' && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              Note: Setting role to seller will automatically approve seller status.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}