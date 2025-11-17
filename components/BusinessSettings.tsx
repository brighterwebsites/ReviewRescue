'use client';

import { useState } from 'react';
import { Business } from '@/types';
import { calculateRemainingWeight } from '@/lib/review-distribution';
import Link from 'next/link';
import { generateReviewEmailTemplate } from '@/lib/email';

interface BusinessSettingsProps {
  business: Business;
}

interface PlatformFormData {
  name: string;
  url: string;
  weight: number;
}

export default function BusinessSettings({ business }: BusinessSettingsProps) {
  const [platforms, setPlatforms] = useState<PlatformFormData[]>(
    business.platforms.length > 0
      ? business.platforms.map(p => ({ name: p.name, url: p.url, weight: p.weight }))
      : [
          { name: 'Google Reviews', url: '', weight: 100 },
          { name: 'Trust Pilot', url: '', weight: 0 },
          { name: 'Facebook Reviews', url: '', weight: 0 },
        ]
  );

  const [isSaving, setIsSaving] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  const updatePlatform = (index: number, field: keyof PlatformFormData, value: string | number) => {
    const newPlatforms = [...platforms];
    newPlatforms[index] = { ...newPlatforms[index], [field]: value };

    // Auto-calculate last platform weight if it's the third one
    if (field === 'weight' && index < 2) {
      const remaining = calculateRemainingWeight(
        newPlatforms.map(p => ({ weight: p.weight })),
        2
      );
      newPlatforms[2].weight = remaining;
    }

    setPlatforms(newPlatforms);
  };

  const totalWeight = platforms.reduce((sum, p) => sum + p.weight, 0);
  const isValid = totalWeight === 100 && platforms.every(p => p.url.trim() !== '' || p.weight === 0);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement save to database
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/review/${business.slug}`;
  const emailHtml = generateReviewEmailTemplate(business.slug, business.name);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin" className="text-indigo-600 hover:text-indigo-700 mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{business.name}</h1>
        <p className="text-gray-600">Configure your review settings and platforms</p>
      </div>

      {/* Business Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input
              type="text"
              value={business.name}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Email</label>
            <input
              type="email"
              value={business.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Review Link */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Review Link</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={reviewUrl}
            readOnly
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(reviewUrl);
              alert('Link copied to clipboard!');
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Copy
          </button>
          <Link
            href={`/review/${business.slug}`}
            target="_blank"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Preview
          </Link>
        </div>
      </div>

      {/* Review Platforms Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Platforms</h2>
        <p className="text-gray-600 mb-6">
          Configure up to 3 review platforms. The weight determines how often happy customers are directed to each platform.
        </p>

        <div className="space-y-6">
          {platforms.map((platform, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    value={platform.name}
                    onChange={(e) => updatePlatform(index, 'name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Google Reviews"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={platform.weight}
                    onChange={(e) => updatePlatform(index, 'weight', parseInt(e.target.value) || 0)}
                    disabled={index === 2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  />
                  {index === 2 && (
                    <p className="text-xs text-gray-500 mt-1">Auto-calculated to make 100%</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review URL
                </label>
                <input
                  type="url"
                  value={platform.url}
                  onChange={(e) => updatePlatform(index, 'url', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Weight Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-700">Total Weight:</span>
            <span className={`font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
              {totalWeight}%
            </span>
          </div>
          {totalWeight !== 100 && (
            <p className="text-sm text-red-600">
              Total weight must equal 100%
            </p>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={!isValid || isSaving}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Email Template */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Template</h2>
        <p className="text-gray-600 mb-4">
          Use this email template to send review requests to your customers
        </p>
        <button
          onClick={() => setShowEmailPreview(!showEmailPreview)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition mb-4"
        >
          {showEmailPreview ? 'Hide' : 'Show'} Email Preview
        </button>

        {showEmailPreview && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 overflow-auto max-h-96">
            <div dangerouslySetInnerHTML={{ __html: emailHtml }} />
          </div>
        )}

        <button
          onClick={() => {
            navigator.clipboard.writeText(emailHtml);
            alert('Email HTML copied to clipboard!');
          }}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Copy Email HTML
        </button>
      </div>
    </div>
  );
}
