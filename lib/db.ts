import { Business, ReviewPlatform, Feedback } from '@/types';

// Mock database for development
// TODO: Replace with actual Prisma client once database is set up

const mockBusinesses: Business[] = [
  {
    id: '1',
    name: "John's Cafe",
    slug: 'johns-cafe',
    email: 'owner@johnscafe.com',
    lastPlatformIndex: 0,
    platforms: [
      {
        id: 'p1',
        businessId: '1',
        name: 'Google Reviews',
        url: 'https://g.page/r/YOUR_GOOGLE_REVIEW_LINK',
        weight: 50,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'p2',
        businessId: '1',
        name: 'Trust Pilot',
        url: 'https://www.trustpilot.com/review/yourbusiness.com',
        weight: 25,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'p3',
        businessId: '1',
        name: 'Facebook',
        url: 'https://www.facebook.com/yourbusiness/reviews',
        weight: 25,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockFeedbacks: Feedback[] = [];

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  return mockBusinesses.find(b => b.slug === slug) || null;
}

export async function getAllBusinesses(): Promise<Business[]> {
  return mockBusinesses;
}

export async function createBusiness(data: {
  name: string;
  slug: string;
  email: string;
}): Promise<Business> {
  const business: Business = {
    id: Date.now().toString(),
    ...data,
    platforms: [],
    lastPlatformIndex: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockBusinesses.push(business);
  return business;
}

export async function updateBusiness(id: string, data: Partial<Business>): Promise<Business | null> {
  const index = mockBusinesses.findIndex(b => b.id === id);
  if (index === -1) return null;
  mockBusinesses[index] = { ...mockBusinesses[index], ...data, updatedAt: new Date() };
  return mockBusinesses[index];
}

export async function createReviewPlatform(data: {
  businessId: string;
  name: string;
  url: string;
  weight: number;
  order: number;
}): Promise<ReviewPlatform> {
  const platform: ReviewPlatform = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const business = mockBusinesses.find(b => b.id === data.businessId);
  if (business) {
    business.platforms.push(platform);
  }

  return platform;
}

export async function updateReviewPlatforms(businessId: string, platforms: Omit<ReviewPlatform, 'id' | 'businessId' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
  const business = mockBusinesses.find(b => b.id === businessId);
  if (!business) return;

  business.platforms = platforms.map((p, index) => ({
    id: business.platforms[index]?.id || Date.now().toString() + index,
    businessId,
    ...p,
    createdAt: business.platforms[index]?.createdAt || new Date(),
    updatedAt: new Date(),
  }));
}

export async function createFeedback(data: {
  businessId: string;
  name: string;
  email: string;
  message: string;
  rating: 'neutral' | 'sad';
}): Promise<Feedback> {
  const feedback: Feedback = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date(),
    read: false,
  };
  mockFeedbacks.push(feedback);
  return feedback;
}

export async function getFeedbackByBusinessId(businessId: string): Promise<Feedback[]> {
  return mockFeedbacks.filter(f => f.businessId === businessId);
}

export async function markFeedbackAsRead(id: string): Promise<void> {
  const feedback = mockFeedbacks.find(f => f.id === id);
  if (feedback) {
    feedback.read = true;
  }
}
