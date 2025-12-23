import React from 'react';
import { Zap } from 'lucide-react';

export default function PointsDisplay({ points, streak }) {
  const nextMilestone = 5000;
  const progress = Math.min((points / nextMilestone) * 100, 100);

  return (
    <div className="card mb-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Points Section */}
        <div className="text-center md:text-left">
          <h2 className="text-gray-600 text-sm font-semibold mb-2">Points Balance</h2>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-5xl font-bold text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {points}
            </div>
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Progress to $5 Gift Card</div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-sm font-semibold text-gray-700">{points}/{nextMilestone}</div>
          </div>
        </div>

        {/* Streak Section */}
        <div className="text-center md:text-left border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-4">Daily Streak</h3>
          <div className="text-4xl font-bold text-primary mb-4">{streak}</div>
          <p className="text-gray-600 text-sm mb-4">day{streak !== 1 ? 's' : ''}</p>
          
          <div className="grid grid-cols-7 gap-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div
                key={i}
                className={`w-8 h-8 flex items-center justify-center rounded font-semibold text-sm ${
                  i < streak
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">Check in daily to earn +5 points</p>
        </div>
      </div>
    </div>
  );
}