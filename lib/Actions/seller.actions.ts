'use server';

import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { formatError } from '../utils';

export async function applyToBeSeller(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Not authenticated' };
    }

    const businessName = formData.get('businessName') as string;
    const whatsappNumber = formData.get('whatsappNumber') as string;
    const storeDescription = formData.get('storeDescription') as string;

    if (!businessName || !whatsappNumber || !storeDescription) {
      return { success: false, message: 'All fields are required' };
    }

    // Check if user already applied
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { sellerStatus: true, businessName: true }
    });

    if (existingUser?.businessName) {
      return { success: false, message: 'You have already applied to be a seller' };
    }

    // Update user with seller information
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        businessName,
        whatsappNumber,
        storeDescription,
        sellerStatus: 'pending'
      }
    });

    return { success: true, message: 'Application submitted successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getSellerApplications() {
  try {
    const applications = await prisma.user.findMany({
      where: {
        businessName: { not: null },
        sellerStatus: 'pending'
      },
      select: {
        id: true,
        name: true,
        email: true,
        businessName: true,
        whatsappNumber: true,
        storeDescription: true,
        createdAt: true
      }
    });

    return applications;
  } catch (error) {
    console.error('Error fetching seller applications:', error);
    return [];
  }
}

export async function approveSellerApplication(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        sellerStatus: 'approved',
        role: 'seller'
      }
    });

    return { success: true, message: 'Seller application approved' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function rejectSellerApplication(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        sellerStatus: 'rejected'
      }
    });

    return { success: true, message: 'Seller application rejected' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getApprovedSellersCount() {
  try {
    const count = await prisma.user.count({
      where: {
        sellerStatus: 'approved',
        role: 'seller'
      }
    });
    return count;
  } catch (error) {
    console.error('Error fetching sellers count:', error);
    return 0;
  }
}

export async function getSellerMetrics(sellerId: string) {
  try {
    const totalProducts = await prisma.product.count({
      where: { sellerId }
    });
    
    const orders = await prisma.orderItem.findMany({
      where: {
        product: { sellerId }
      },
      include: {
        order: true
      }
    });
    
    const totalSales = orders.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
    const totalOrders = orders.length;
    
    return {
      totalProducts,
      totalSales,
      totalOrders
    };
  } catch (error) {
    return {
      totalProducts: 0,
      totalSales: 0,
      totalOrders: 0
    };
  }
}

export async function getSellerProducts(sellerId: string) {
  try {
    const products = await prisma.product.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' }
    });
    return products;
  } catch (error) {
    return [];
  }
}

export async function getSellerSalesData(sellerId: string) {
  try {
    const orders = await prisma.orderItem.findMany({
      where: {
        product: { sellerId }
      },
      include: {
        order: {
          select: {
            createdAt: true
          }
        }
      }
    });
    
    // Group by month
    const monthlyData = orders.reduce((acc: any, item) => {
      const month = new Date(item.order.createdAt).toLocaleDateString('en-US', { month: 'short' });
      const sales = Number(item.price) * item.qty;
      
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += sales;
      
      return acc;
    }, {});
    
    return Object.entries(monthlyData).map(([month, sales]) => ({
      month,
      sales: Number(sales)
    }));
  } catch (error) {
    return [
      { month: 'Jan', sales: 0 },
      { month: 'Feb', sales: 0 },
      { month: 'Mar', sales: 0 }
    ];
  }
}

// Update seller status
export async function updateSellerStatus(sellerId: string, status: string) {
  try {
    await prisma.user.update({
      where: { id: sellerId },
      data: { 
        sellerStatus: status,
        role: status === 'approved' ? 'seller' : 'user'
      }
    });
    
    revalidatePath('/admin/sellers');
    return { success: true, message: `Seller ${status} successfully` };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}