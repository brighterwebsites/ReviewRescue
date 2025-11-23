import { notFound, redirect } from 'next/navigation';
import { getBusinessBySlug, updateBusinessLastVisit } from '@/lib/db';
import { getNextReviewPlatform } from '@/lib/review-distribution';
import { SentimentType } from '@/types';
import SentimentSelector from '@/components/SentimentSelector';

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: {
    sentiment?: string;
  };
}

export default async function ReviewPage({ params, searchParams }: PageProps) {
  const business = await getBusinessBySlug(params.slug);

  if (!business) {
    notFound();
  }

  // Track visit to review page
  await updateBusinessLastVisit(business.id);

  // If sentiment is already selected, handle the redirect or show form
  const sentiment = searchParams.sentiment as SentimentType | undefined;

  if (sentiment === 'happy') {
    // Get next platform based on weighting
    const platform = await getNextReviewPlatform(business);

    if (platform) {
      redirect(platform.url);
    } else {
      // No platforms configured
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
            <div className="text-6xl mb-4">😊</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Thank you for your feedback!
            </h1>
            <p className="text-gray-600">
              We appreciate you taking the time to share your experience.
            </p>
          </div>
        </div>
      );
    }
  }

  if (sentiment === 'neutral' || sentiment === 'sad') {
    // Show feedback form
    redirect(`/feedback/${params.slug}?rating=${sentiment}`);
  }

  // Show sentiment selector
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <SentimentSelector
        businessName={business.name}
        businessSlug={business.slug}
        logoUrl={business.logoUrl}
      />
    </div>
  );
}
