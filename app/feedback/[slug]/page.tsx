import { notFound } from 'next/navigation';
import { getBusinessBySlug } from '@/lib/db';
import FeedbackForm from '@/components/FeedbackForm';

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: {
    rating?: string;
  };
}

export default async function FeedbackPage({ params, searchParams }: PageProps) {
  const business = await getBusinessBySlug(params.slug);

  if (!business) {
    notFound();
  }

  const rating = (searchParams.rating || 'neutral') as 'neutral' | 'sad';

  const heading = rating === 'sad'
    ? "We are so sorry things didn't go as planned, we would love to know how we can do better - would you please share your experience so we can improve?"
    : "Sorry we didn't seem to meet your expectations. How can we do better? We'd love to hear from you...";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">
            {rating === 'sad' ? '😞' : '😐'}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {heading}
          </h1>
        </div>

        <FeedbackForm businessId={business.id} businessSlug={business.slug} rating={rating} />
      </div>
    </div>
  );
}
