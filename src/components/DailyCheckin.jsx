import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import {
  createDailyCheckin,
  updateUserPoints,
  updateUserStreak,
  addPointHistory,
  hasCheckedInToday,
} from "../utils/supabaseQueries";

export default function DailyCheckin({
  userId,
  onCheckinSuccess,
  userPoints,
  currentStreak,
  canCheckinToday,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckin = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Starting checkin process...");
      console.log("Can check in today?", canCheckinToday);

      // Double check if user already checked in
      const alreadyCheckedIn = await hasCheckedInToday(userId);
      console.log("Already checked in today?", alreadyCheckedIn);

      if (alreadyCheckedIn) {
        setError("You have already checked in today! Come back tomorrow.");
        setLoading(false);
        return;
      }

      // Create checkin record
      console.log("Creating checkin...");
      await createDailyCheckin(userId);
      console.log("✅ Checkin created");

      // Update points
      console.log("Updating points from", userPoints, "to", userPoints + 5);
      const newPoints = userPoints + 5;
      await updateUserPoints(userId, newPoints);
      console.log("✅ Points updated:", newPoints);

      // Update streak
      console.log(
        "Updating streak from",
        currentStreak,
        "to",
        currentStreak + 1
      );
      const newStreak = currentStreak + 1;
      await updateUserStreak(userId, newStreak);
      console.log("✅ Streak updated:", newStreak);

      // Add to history
      console.log("Recording in point_history...");
      await addPointHistory(userId, 5, "daily_checkin", "Daily check-in bonus");
      console.log("✅ History recorded");

      // Success
      setError(null);
      alert("🎉 Check-in successful!\n+5 points\n🔥 Streak +1");
      onCheckinSuccess();
    } catch (err) {
      console.error("❌ Checkin error:", err);
      setError(err.message || "Failed to check in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            📱 Check In Today
          </h2>
          <p className="text-gray-600 text-sm">
            {canCheckinToday
              ? "✨ You haven't checked in yet. Earn +5 points!"
              : "✅ You've checked in today. Great job! Come back tomorrow."}
          </p>
        </div>
        <button
          onClick={handleCheckin}
          disabled={!canCheckinToday || loading}
          className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
            canCheckinToday && !loading
              ? "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg cursor-pointer"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Checking In...
            </>
          ) : !canCheckinToday ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Checked In
            </>
          ) : (
            "Check In Now"
          )}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
