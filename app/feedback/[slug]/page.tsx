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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">
            {rating === 'sad' ? '😞' : '😐'}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            We'd love to hear from you
          </h1>
          <p className="text-gray-600">
            Your feedback helps us improve. Please share your thoughts with {business.name}.
          </p>
        </div>

        <FeedbackForm businessId={business.id} businessSlug={business.slug} rating={rating} />
      </div>
    </div>
  );
}
