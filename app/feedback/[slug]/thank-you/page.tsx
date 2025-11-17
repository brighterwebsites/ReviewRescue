export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thank You!
        </h1>
        <p className="text-gray-600 mb-6">
          Your feedback has been received and will be reviewed by the business owner. We appreciate you taking the time to help us improve.
        </p>
        <div className="p-4 bg-indigo-50 rounded-lg">
          <p className="text-sm text-indigo-800">
            The business will be in touch with you soon to address your concerns.
          </p>
        </div>
      </div>
    </div>
  );
}
