'use client';

import Link from 'next/link';

interface SentimentSelectorProps {
  businessName: string;
  businessSlug: string;
}

export default function SentimentSelector({ businessName, businessSlug }: SentimentSelectorProps) {
  return (
    <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          How was your experience with {businessName}?
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          We'd love to hear your feedback!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Happy */}
          <Link
            href={`/review/${businessSlug}?sentiment=happy`}
            className="group p-8 rounded-xl border-2 border-transparent hover:border-green-500 hover:bg-green-50 transition-all transform hover:scale-105 cursor-pointer"
          >
            <div className="text-7xl md:text-8xl mb-4 transform group-hover:scale-110 transition-transform">
              😊
            </div>
            <h3 className="text-xl font-semibold text-green-600 mb-2">Great!</h3>
            <p className="text-sm text-gray-600">Everything was wonderful</p>
          </Link>

          {/* Neutral */}
          <Link
            href={`/review/${businessSlug}?sentiment=neutral`}
            className="group p-8 rounded-xl border-2 border-transparent hover:border-yellow-500 hover:bg-yellow-50 transition-all transform hover:scale-105 cursor-pointer"
          >
            <div className="text-7xl md:text-8xl mb-4 transform group-hover:scale-110 transition-transform">
              😐
            </div>
            <h3 className="text-xl font-semibold text-yellow-600 mb-2">Okay</h3>
            <p className="text-sm text-gray-600">It was alright</p>
          </Link>

          {/* Sad */}
          <Link
            href={`/review/${businessSlug}?sentiment=sad`}
            className="group p-8 rounded-xl border-2 border-transparent hover:border-red-500 hover:bg-red-50 transition-all transform hover:scale-105 cursor-pointer"
          >
            <div className="text-7xl md:text-8xl mb-4 transform group-hover:scale-110 transition-transform">
              😞
            </div>
            <h3 className="text-xl font-semibold text-red-600 mb-2">Not Great</h3>
            <p className="text-sm text-gray-600">Could be better</p>
          </Link>
        </div>

        <p className="mt-12 text-sm text-gray-500">
          Your feedback helps us improve our service
        </p>
      </div>
    </div>
  );
}
