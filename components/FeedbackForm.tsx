'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FeedbackFormProps {
  businessId: string;
  businessSlug: string;
  rating: 'neutral' | 'sad';
}

const getEmojiForStars = (stars: number): string => {
  switch (stars) {
    case 5: return '😊';
    case 4: return '😐';
    case 3: return '😟';
    case 2: return '😞';
    case 1: return '😡';
    default: return '😐';
  }
};

export default function FeedbackForm({ businessId, businessSlug, rating }: FeedbackFormProps) {
  const router = useRouter();
  const defaultStars = rating === 'sad' ? 3 : 4;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    stars: defaultStars,
    wantsContact: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const formHeading = rating === 'sad'
    ? "We are so sorry things didn't go as planned, we would love to know how we can do better - would you please share your experience so we can improve?"
    : "Sorry we didn't seem to meet your expectations. How can we do better? We'd love to hear from you...";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          businessId,
          rating,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      // Redirect to thank you page
      router.push(`/feedback/${businessSlug}/thank-you`);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          How would you rate your experience? *
        </label>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, stars: star })}
                className="text-4xl hover:scale-110 transition-transform"
              >
                {star <= formData.stars ? '⭐' : '☆'}
              </button>
            ))}
          </div>
          <div className="text-5xl ml-4 transform transition-all duration-300">
            {getEmojiForStars(formData.stars)}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Your Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Your Email *
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Your Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="0400 000 000"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Your Feedback *
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          placeholder="Please tell us about your experience..."
        />
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          id="wantsContact"
          checked={formData.wantsContact}
          onChange={(e) => setFormData({ ...formData, wantsContact: e.target.checked })}
          className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="wantsContact" className="ml-3 text-sm text-gray-700">
          Would you like us to contact you about your experience?
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your feedback will be sent directly to the business owner.
      </p>
    </form>
  );
}
