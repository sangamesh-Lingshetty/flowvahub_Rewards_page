import React, { useState } from 'react';
import { Share2, Copy, CheckCircle2 } from 'lucide-react';

export default function ReferralSection({ userId, referralCode }) {
  const [copied, setCopied] = useState(false);
  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        <Share2 className="w-6 h-6 text-primary" />
        Refer & Earn
      </h2>
      <p className="text-gray-600 text-sm mb-6">
        Invite 3 friends and earn a chance to win 10,000 points!
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Referral Stats */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Your Referrals</p>
            <p className="text-4xl font-bold text-primary mb-4">0</p>
            <p className="text-gray-600 text-sm">Friends invited</p>
          </div>
        </div>

        {/* Points Earned */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Points Earned</p>
            <p className="text-4xl font-bold text-primary mb-4">0</p>
            <p className="text-gray-600 text-sm">From referrals</p>
          </div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600 text-sm mb-3">Your personal referral link:</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
          />
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-primary text-white hover:shadow-lg'
            }`}
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy Link
              </>
            )}
          </button>
        </div>
      </div>

      {/* Referral Challenge */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary to-secondary rounded-lg text-white">
        <h3 className="font-bold mb-2">🎁 Special Challenge</h3>
        <p className="text-sm mb-3">
          Refer 3 friends by Dec 31st and get a chance to win 10,000 points!
        </p>
        <div className="w-full bg-white/30 rounded-full h-2">
          <div className="bg-white h-2 rounded-full" style={{ width: '0%' }}></div>
        </div>
        <p className="text-xs mt-2">0/3 referrals</p>
      </div>
    </div>
  );
}