import React, { useState } from 'react';
import { Calendar, Loader2, CheckCircle2 } from 'lucide-react';
import { hasCheckedInToday, createDailyCheckin, updateUserPoints, addPointHistory } from '../utils/supabaseQueries';

export default function DailyCheckin({ userId, onCheckinSuccess, userPoints, canCheckinToday }) {
  const [loading, setLoading] = useState(false);

  const handleCheckin = async () => {
    setLoading(true);
    try {
      if (!canCheckinToday) {
        alert('You have already checked in today!');
        setLoading(false);
        return;
      }

      // Create checkin
      await createDailyCheckin(userId);

      // Update points
      const newPoints = userPoints + 5;
      await updateUserPoints(userId, newPoints);

      // Add to point history
      await addPointHistory(userId, 5, 'daily_checkin', 'Daily check-in bonus');

      onCheckinSuccess();
    } catch (error) {
      alert('Failed to check in: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Daily Check-in
          </h2>
          <p className="text-gray-600 text-sm">
            {canCheckinToday
              ? 'You haven\'t checked in today yet. Earn +5 points!'
              : 'You\'ve already checked in today. Come back tomorrow!'}
          </p>
        </div>
        <button
          onClick={handleCheckin}
          disabled={!canCheckinToday || loading}
          className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
            canCheckinToday && !loading
              ? 'btn-primary'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Checking in...
            </>
          ) : !canCheckinToday ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Checked In
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5" />
              Check In Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}