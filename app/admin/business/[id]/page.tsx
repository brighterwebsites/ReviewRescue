import { notFound } from 'next/navigation';
import { getBusinessBySlug, getAllBusinesses } from '@/lib/db';
import BusinessSettings from '@/components/BusinessSettings';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function BusinessManagePage({ params }: PageProps) {
  // In a real app, we'd fetch by ID, but for demo we'll find by ID in our mock data
  const businesses = await getAllBusinesses();
  const business = businesses.find(b => b.id === params.id);

  if (!business) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BusinessSettings business={business} />
      </div>
    </div>
  );
}
