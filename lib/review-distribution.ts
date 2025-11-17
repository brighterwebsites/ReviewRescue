import { Business, ReviewPlatform } from '@/types';
import { updateBusiness } from './db';

/**
 * Determines which review platform to redirect a happy customer to
 * based on the configured weighting distribution
 */
export async function getNextReviewPlatform(business: Business): Promise<ReviewPlatform | null> {
  const platforms = business.platforms.filter(p => p.weight > 0).sort((a, b) => a.order - b.order);

  if (platforms.length === 0) return null;
  if (platforms.length === 1) return platforms[0];

  // Calculate total weight
  const totalWeight = platforms.reduce((sum, p) => sum + p.weight, 0);

  // If total weight is 100, use round-robin distribution
  if (totalWeight === 100) {
    const platform = platforms[business.lastPlatformIndex % platforms.length];

    // Update the index for next time
    await updateBusiness(business.id, {
      lastPlatformIndex: business.lastPlatformIndex + 1,
    });

    return platform;
  }

  // Otherwise, use weighted random selection
  const random = Math.random() * totalWeight;
  let cumulative = 0;

  for (const platform of platforms) {
    cumulative += platform.weight;
    if (random <= cumulative) {
      return platform;
    }
  }

  return platforms[0]; // Fallback
}

/**
 * Validates that platform weights are valid
 */
export function validatePlatformWeights(platforms: { weight: number }[]): {
  valid: boolean;
  error?: string;
} {
  if (platforms.length === 0) {
    return { valid: false, error: 'At least one platform is required' };
  }

  const totalWeight = platforms.reduce((sum, p) => sum + p.weight, 0);

  if (totalWeight !== 100) {
    return { valid: false, error: `Total weight must equal 100% (currently ${totalWeight}%)` };
  }

  const hasInvalidWeight = platforms.some(p => p.weight < 0 || p.weight > 100);
  if (hasInvalidWeight) {
    return { valid: false, error: 'Each platform weight must be between 0 and 100' };
  }

  return { valid: true };
}

/**
 * Auto-calculates the weight for the last platform to make total = 100%
 */
export function calculateRemainingWeight(platforms: { weight: number }[], excludeIndex: number): number {
  const total = platforms.reduce((sum, p, index) => {
    if (index === excludeIndex) return sum;
    return sum + p.weight;
  }, 0);

  return Math.max(0, 100 - total);
}
