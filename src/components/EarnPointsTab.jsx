import { useState } from "react";
import { Share2, Users, Loader2, CheckCircle2 } from "lucide-react";
import {
  createDailyCheckin,
  updateUserPoints,
  updateUserStreak,
  addPointHistory,
  hasCheckedInToday,
} from "../utils/supabaseQueries";

export default function EarnPointsTab({
  userId,
  userPoints,
  currentStreak,
  canCheckinToday,
  onCheckinSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle check-in directly in this component
  const handleCheckin = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("=== CHECKIN START ===");
      console.log("User ID:", userId);
      console.log("Can check in today?", canCheckinToday);

      // Double check if user already checked in
      const alreadyCheckedIn = await hasCheckedInToday(userId);
      console.log("Already checked in today?", alreadyCheckedIn);

      if (alreadyCheckedIn) {
        setError("You have already checked in today! Come back tomorrow.");
        setLoading(false);
        return;
      }

      // 1. Create checkin record
      console.log("Step 1: Creating checkin...");
      await createDailyCheckin(userId);
      console.log("✅ Checkin created");

      // 2. Update points
      console.log("Step 2: Updating points...");
      const newPoints = userPoints + 5;
      await updateUserPoints(userId, newPoints);
      console.log("✅ Points updated:", newPoints);

      // 3. Update streak
      console.log("Step 3: Updating streak...");
      const newStreak = currentStreak + 1;
      await updateUserStreak(userId, newStreak);
      console.log("✅ Streak updated:", newStreak);

      // 4. Add to history
      console.log("Step 4: Recording in point_history...");
      await addPointHistory(userId, 5, "daily_checkin", "Daily check-in bonus");
      console.log("✅ History recorded");

      console.log("=== CHECKIN SUCCESS ===");
      alert("🎉 Check-in successful!\n+5 points\n🔥 Streak +1");
      onCheckinSuccess();
    } catch (err) {
      console.error("❌ CHECKIN ERROR:", err);
      setError(err.message || "Failed to check in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ============= YOUR REWARDS JOURNEY ============= */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <div className="w-1.5 h-8 bg-primary rounded-r-lg"></div>
          Your Rewards Journey
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT: Points Balance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">💎</span>
              <h3 className="font-bold text-gray-800">Points Balance</h3>
            </div>

            <div className="mb-6">
              <p className="text-7xl font-bold text-primary">{userPoints}</p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Progress to $5 Gift Card
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((userPoints / 5000) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm font-semibold text-gray-700 mt-2">
                  {userPoints}/5000
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 mt-6 flex items-center gap-1">
              🚀 Just getting started — keep earning points!
            </p>
          </div>

          {/* MIDDLE: Daily Streak */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">📅</span>
              <h3 className="font-bold text-gray-800">Daily Streak</h3>
            </div>

            <div className="mb-8">
              <p className="text-7xl font-bold text-primary">{currentStreak}</p>
              <p className="text-gray-600 text-sm mt-2">
                day{currentStreak !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Calendar */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-xs font-bold text-gray-600 mb-1.5">
                    {day}
                  </p>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      idx === 1 // Today is Tuesday (index 1)
                        ? currentStreak > 0
                          ? "bg-primary text-white ring-2 ring-primary ring-offset-2"
                          : "bg-gray-200 text-gray-400"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {idx === 1 && currentStreak > 0 ? "✓" : ""}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-600 text-center mb-4">
              Check in daily to to earn +5 points
            </p>

            {/* CHECK IN BUTTON - LOGIC FIXED */}
            {canCheckinToday ? (
              // Button ENABLED if NOT checked in today
              <button
                onClick={handleCheckin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Checking In...
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    Check In Now
                  </>
                )}
              </button>
            ) : (
              // Button DISABLED if already checked in today
              <button
                disabled
                className="w-full bg-gray-300 text-gray-600 py-3 px-4 rounded-full font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <span>⚡</span>
                Claimed Today
              </button>
            )}
          </div>

          {/* RIGHT: Featured */}
          <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 rounded-lg shadow-lg p-6 text-white relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <span className="inline-block bg-white/30 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                Featured
              </span>

              <h3 className="text-2xl font-bold mb-3">Top Tool Spotlight</h3>
              <p className="text-lg font-bold text-blue-100 mb-6">Reclaim</p>

              <p className="text-sm text-white/90 mb-6">
                Automate and Optimize Your Schedule
              </p>

              <p className="text-xs text-white/80 mb-6 leading-relaxed">
                Reclaim.ai is an AI-powered calendar assistant that
                automatically schedules your tasks, meetings, and breaks to
                boost productivity. Free to try — earn Flowva Points when you
                sign up!
              </p>

              <div className="flex gap-3">
                <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-full transition-all">
                  👤 Sign up
                </button>
                <button className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-2 rounded-full transition-all">
                  🎁 Claim 50 pts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* ============= EARN MORE POINTS ============= */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <div className="w-1.5 h-8 bg-primary rounded-r-lg"></div>
          Earn More Points
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Referral Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-3xl">⭐</span>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Refer and win 10,000 points!
                </h3>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-4">
              Invite 3 friends by Nov 20 and earn a chance to be one of 5
              winners of{" "}
              <span className="font-bold text-primary">10,000 points</span>.
              Friends must complete onboarding to qualify.
            </p>
          </div>

          {/* Share Stack Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-3xl">🔗</span>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Share Your Stack
                </h3>
                <p className="text-sm text-gray-600">Earn +25 pts</p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-4">Share your tool stack</p>

            <button className="text-primary font-bold text-sm flex items-center gap-2 hover:text-primary/80">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* ============= REFER & EARN ============= */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <div className="w-1.5 h-8 bg-primary rounded-r-lg"></div>
          Refer & Earn
        </h2>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-gray-800">Share Your Link</h3>
          </div>

          <p className="text-sm text-gray-600 mb-8">
            Invite friends and earn 25 points when they join!
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-200">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">0</p>
              <p className="text-sm text-gray-600 mt-2">Referrals</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">0</p>
              <p className="text-sm text-gray-600 mt-2">Points Earned</p>
            </div>
          </div>

          {/* Referral Link Input */}
          <p className="text-sm text-gray-700 font-semibold mb-3">
            Your personal referral link:
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value="https://app.flowvahub.com/signup?ref=sanga1525"
              readOnly
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  "https://app.flowvahub.com/signup?ref=sanga1525"
                );
                alert("✅ Link copied!");
              }}
              className="px-4 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all"
            >
              📋
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
