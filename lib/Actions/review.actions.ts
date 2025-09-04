'use server'

import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { formatError } from '../utils'
import { reviewSchema } from '../validator'
import { revalidatePath } from 'next/cache'

export async function createUpdateReview(data: {
  productId: string
  rating: number
  title: string
  description: string
}) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      throw new Error('User is not authenticated')
    }

    const review = reviewSchema.parse(data)

    const existingReview = await prisma.review.findFirst({
      where: {
        productId: review.productId,
        userId: session.user.id!
      }
    })

    if (existingReview) {
      await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating: review.rating,
          title: review.title,
          description: review.description
        }
      })
    } else {
      await prisma.review.create({
        data: {
          ...review,
          userId: session.user.id!
        }
      })
    }

    // Update product rating
    const reviews = await prisma.review.findMany({
      where: { productId: review.productId }
    })
    
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    
    await prisma.product.update({
      where: { id: review.productId },
      data: { 
        rating: avgRating,
        numReviews: reviews.length
      }
    })

    revalidatePath(`/product/${review.productId}`)
    
    return {
      success: true,
      message: 'Review created successfully'
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    }
  }
}