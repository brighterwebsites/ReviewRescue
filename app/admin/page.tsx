import Link from 'next/link';
import { getAllBusinesses } from '@/lib/db';

export default async function AdminPage() {
  const businesses = await getAllBusinesses();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your businesses and review settings</p>
        </div>

        {/* Actions */}
        <div className="mb-8 flex gap-4">
          <Link
            href="/admin/new"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            + Add New Business
          </Link>
        </div>

        {/* Businesses List */}
        {businesses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🏢</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No businesses yet</h2>
            <p className="text-gray-600 mb-6">Get started by adding your first business</p>
            <Link
              href="/admin/new"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Add Your First Business
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {businesses.map((business) => (
              <div key={business.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{business.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Link:</span> /review/{business.slug}
                </p>

                <div className="mb-4 space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Platforms:</span>
                    <span className="ml-2 text-gray-600">
                      {business.platforms.length} configured
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-600">{business.email}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/business/${business.id}`}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition text-center"
                  >
                    Manage
                  </Link>
                  <Link
                    href={`/review/${business.slug}`}
                    target="_blank"
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition text-center"
                  >
                    Preview
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Demo Section */}
        <div className="mt-12 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-indigo-900 mb-2">Try the Demo</h2>
          <p className="text-indigo-700 mb-4">
            See how ReviewRescue works with our pre-configured demo business
          </p>
          <Link
            href="/review/johns-cafe"
            target="_blank"
            className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            View Demo
          </Link>
        </div>

        {/* Version Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            ReviewRescue v0.2.0 • Build: {new Date().toISOString().split('T')[0]}
          </p>
        </div>
      </div>
    </div>
  );
}
