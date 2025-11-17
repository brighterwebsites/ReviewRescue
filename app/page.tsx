import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ReviewRescue
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Prevent negative reviews by redirecting unhappy customers to a private feedback form
          </p>

          <div className="grid md:grid-cols-3 gap-6 my-12">
            <div className="p-6 bg-green-50 rounded-lg">
              <div className="text-4xl mb-3">😊</div>
              <h3 className="font-semibold text-gray-900 mb-2">Happy Customers</h3>
              <p className="text-sm text-gray-600">Redirect to your review platforms</p>
            </div>

            <div className="p-6 bg-yellow-50 rounded-lg">
              <div className="text-4xl mb-3">😐</div>
              <h3 className="font-semibold text-gray-900 mb-2">Neutral Feedback</h3>
              <p className="text-sm text-gray-600">Collect private feedback</p>
            </div>

            <div className="p-6 bg-red-50 rounded-lg">
              <div className="text-4xl mb-3">😞</div>
              <h3 className="font-semibold text-gray-900 mb-2">Unhappy Customers</h3>
              <p className="text-sm text-gray-600">Address concerns privately</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Admin Dashboard
            </Link>
            <Link
              href="/demo"
              className="px-8 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              View Demo
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-3xl font-bold text-indigo-600 mb-2">1</div>
                <h3 className="font-semibold mb-2">Send Review Link</h3>
                <p className="text-sm text-gray-600">
                  Email customers your custom review link with clickable emoji buttons
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600 mb-2">2</div>
                <h3 className="font-semibold mb-2">Smart Routing</h3>
                <p className="text-sm text-gray-600">
                  Happy customers go to review platforms, others to private feedback
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600 mb-2">3</div>
                <h3 className="font-semibold mb-2">Improve & Respond</h3>
                <p className="text-sm text-gray-600">
                  Address concerns privately before they become public reviews
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
