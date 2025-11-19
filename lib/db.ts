import { PrismaClient } from '@prisma/client';
import { Business, ReviewPlatform, Feedback, Stat } from '@/types';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Business operations
export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      platforms: {
        orderBy: { order: 'asc' },
      },
    },
  });

  return business as Business | null;
}

export async function getAllBusinesses(): Promise<Business[]> {
  const businesses = await prisma.business.findMany({
    include: {
      platforms: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return businesses as Business[];
}

export async function createBusiness(data: {
  name: string;
  slug: string;
  email: string;
}): Promise<Business> {
  const business = await prisma.business.create({
    data: {
      ...data,
      platforms: {
        create: [
          {
            name: 'Google Reviews',
            url: '',
            weight: 100,
            order: 0,
          },
          {
            name: 'Trust Pilot',
            url: '',
            weight: 0,
            order: 1,
          },
          {
            name: 'Facebook Reviews',
            url: '',
            weight: 0,
            order: 2,
          },
        ],
      },
    },
    include: {
      platforms: {
        orderBy: { order: 'asc' },
      },
    },
  });

  return business as Business;
}

export async function updateBusiness(
  id: string,
  data: Partial<{
    name: string;
    email: string;
    websiteUrl: string;
    facebookUrl: string;
    instagramUrl: string;
    linkedinUrl: string;
    logoUrl: string;
    lastPlatformIndex: number;
  }>
): Promise<Business | null> {
  const business = await prisma.business.update({
    where: { id },
    data,
    include: {
      platforms: {
        orderBy: { order: 'asc' },
      },
    },
  });

  return business as Business;
}

export async function deleteBusiness(id: string): Promise<boolean> {
  try {
    await prisma.business.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
}

// Platform operations
export async function updateReviewPlatforms(
  businessId: string,
  platforms: Array<{
    name: string;
    url: string;
    weight: number;
    order: number;
  }>
): Promise<void> {
  // Delete existing platforms
  await prisma.reviewPlatform.deleteMany({
    where: { businessId },
  });

  // Create new platforms
  await prisma.reviewPlatform.createMany({
    data: platforms.map((p) => ({
      ...p,
      businessId,
    })),
  });
}

// Feedback operations
export async function createFeedback(data: {
  businessId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  rating: 'neutral' | 'sad';
  stars: number;
  wantsContact: boolean;
}): Promise<Feedback> {
  const feedback = await prisma.feedback.create({
    data: {
      ...data,
      phone: data.phone || null,
    },
  });

  return feedback as Feedback;
}

export async function getFeedbackByBusinessId(businessId: string): Promise<Feedback[]> {
  const feedbacks = await prisma.feedback.findMany({
    where: { businessId },
    orderBy: { createdAt: 'desc' },
  });

  return feedbacks as Feedback[];
}

export async function markFeedbackAsRead(id: string): Promise<void> {
  await prisma.feedback.update({
    where: { id },
    data: { read: true },
  });
}

// Stats operations
export async function createStat(data: {
  businessId: string;
  eventType: string;
  platformName?: string;
}): Promise<Stat> {
  const stat = await prisma.stat.create({
    data: {
      ...data,
      platformName: data.platformName || null,
    },
  });

  return stat as Stat;
}

export async function getStatsByBusinessId(
  businessId: string,
  daysAgo?: number
): Promise<Stat[]> {
  const where: any = { businessId };

  if (daysAgo) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    where.createdAt = {
      gte: date,
    };
  }

  const stats = await prisma.stat.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return stats as Stat[];
}

export async function resetStatsByBusinessId(businessId: string): Promise<void> {
  await prisma.stat.deleteMany({
    where: { businessId },
  });
}
