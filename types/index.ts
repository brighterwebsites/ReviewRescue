export interface Business {
  id: string;
  name: string;
  slug: string;
  email: string;
  platforms: ReviewPlatform[];
  lastPlatformIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewPlatform {
  id: string;
  businessId: string;
  name: string;
  url: string;
  weight: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Feedback {
  id: string;
  businessId: string;
  name: string;
  email: string;
  message: string;
  rating: 'neutral' | 'sad';
  createdAt: Date;
  read: boolean;
}

export type SentimentType = 'happy' | 'neutral' | 'sad';
