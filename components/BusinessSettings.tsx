'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Business } from '@/types';
import { calculateRemainingWeight } from '@/lib/review-distribution';
import Link from 'next/link';

interface BusinessSettingsProps {
  business: Business;
}

interface PlatformFormData {
  name: string;
  url: string;
  weight: number;
}

export default function BusinessSettings({ business }: BusinessSettingsProps) {
  const router = useRouter();

  const [businessInfo, setBusinessInfo] = useState({
    name: business.name,
    email: business.email,
    websiteUrl: business.websiteUrl || '',
    facebookUrl: business.facebookUrl || '',
    instagramUrl: business.instagramUrl || '',
    linkedinUrl: business.linkedinUrl || '',
    logoUrl: business.logoUrl || '',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleLogoUpload = async (file: File) => {
    setIsUploadingLogo(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('logo', file);
      formData.append('businessSlug', business.slug);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload logo');
      }

      // Update businessInfo with new logo URL
      setBusinessInfo({ ...businessInfo, logoUrl: data.logoUrl });
      setSuccess('Logo uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logo upload failed');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      // Use POST instead of PATCH (workaround for proxy blocking PATCH)
      const response = await fetch(`/api/business/${business.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: businessInfo.name,
          email: businessInfo.email,
          websiteUrl: businessInfo.websiteUrl,
          facebookUrl: businessInfo.facebookUrl,
          instagramUrl: businessInfo.instagramUrl,
          linkedinUrl: businessInfo.linkedinUrl,
          logoUrl: businessInfo.logoUrl,
          platforms: platforms.map((p, index) => ({
            name: p.name,
            url: p.url,
            weight: p.weight,
            order: index,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${business.name}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      // Use POST with _method=DELETE (workaround for proxy blocking DELETE)
      const response = await fetch(`/api/business/${business.id}?_method=DELETE`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete business');
      }

      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsDeleting(false);
    }
  };

  const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/review/${business.slug}`;
  const emailTemplate = generateGmailFriendlyTemplate(business.slug, business.name, reviewUrl);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <Link href="/admin" className="text-indigo-600 hover:text-indigo-700 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{business.name}</h1>
          <p className="text-gray-600">Configure your review settings and platforms</p>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {isDeleting ? 'Deleting...' : 'Delete Business'}
        </button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
          {success}
        </div>
      )}

      {/* Business Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input
              type="text"
              value={businessInfo.name}
              onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Email</label>
            <input
              type="email"
              value={businessInfo.email}
              onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Feedback notifications will be sent here</p>
          </div>
        </div>
      </div>

      {/* Logo and Social Media Links */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Branding & Social Links</h2>

        {/* Logo Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Logo</label>
          <div className="flex items-center gap-4">
            {businessInfo.logoUrl && (
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                <img
                  src={businessInfo.logoUrl}
                  alt="Business logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      setError('Logo file size must be less than 5MB');
                      return;
                    }
                    handleLogoUpload(file);
                  }
                }}
                disabled={isUploadingLogo}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                JPG or PNG, max 5MB. Will be auto-resized to 200px height.
              </p>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
            <input
              type="url"
              value={businessInfo.websiteUrl}
              onChange={(e) => setBusinessInfo({ ...businessInfo, websiteUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="https://www.example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
            <input
              type="url"
              value={businessInfo.facebookUrl}
              onChange={(e) => setBusinessInfo({ ...businessInfo, facebookUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
            <input
              type="url"
              value={businessInfo.instagramUrl}
              onChange={(e) => setBusinessInfo({ ...businessInfo, instagramUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="https://instagram.com/yourprofile"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={businessInfo.linkedinUrl}
              onChange={(e) => setBusinessInfo({ ...businessInfo, linkedinUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="https://linkedin.com/company/yourcompany"
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
              setSuccess('Link copied to clipboard!');
              setTimeout(() => setSuccess(''), 2000);
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
          Copy this text to use in Gmail signature or email body
        </p>
        <button
          onClick={() => setShowEmailPreview(!showEmailPreview)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition mb-4"
        >
          {showEmailPreview ? 'Hide' : 'Show'} Email Template
        </button>

        {showEmailPreview && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4">
            <pre className="whitespace-pre-wrap text-sm font-mono">{emailTemplate}</pre>
          </div>
        )}

        <button
          onClick={() => {
            navigator.clipboard.writeText(emailTemplate);
            setSuccess('Email template copied to clipboard! Paste it into Gmail.');
            setTimeout(() => setSuccess(''), 3000);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Copy for Gmail
        </button>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 mb-2">
            <strong>How to use in Gmail:</strong>
          </p>
          <ol className="text-sm text-blue-800 list-decimal list-inside space-y-1">
            <li>Copy the template above</li>
            <li>In Gmail, compose a new email or open Settings → Signature</li>
            <li>Paste the template directly</li>
            <li>Gmail will automatically convert the URLs to clickable links</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function generateGmailFriendlyTemplate(slug: string, businessName: string, reviewUrl: string): string {
  return `How was your experience with ${businessName}?

We'd love to hear your feedback!

😊 Great! - ${reviewUrl}?sentiment=happy
😐 Okay - ${reviewUrl}?sentiment=neutral
😞 Not Great - ${reviewUrl}?sentiment=sad

Thank you for taking the time to share your feedback!`;
}
