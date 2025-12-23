import { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";

export default function StreakCalendar({
  userId,
  currentStreak,
  onCheckinSuccess,
  canCheckinToday,
}) {
  const [checkinDates, setCheckinDates] = useState([]);
  const [currentDate] = useState(new Date());

  useEffect(() => {
    fetchCheckinDates();
  }, [userId]);

  const fetchCheckinDates = async () => {
    try {
      const { data, error } = await supabase
        .from("daily_checkins")
        .select("checkin_date")
        .eq("user_id", userId)
        .order("checkin_date", { ascending: true });

      if (error) throw error;
      setCheckinDates(data.map((d) => d.checkin_date));
    } catch (err) {
      console.error("Error fetching checkin dates:", err);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  // Get last 7 days
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    last7Days.push({
      day: days[date.getDay()],
      date: dateStr,
      isCheckedIn: checkinDates.includes(dateStr),
      isToday: dateStr === today,
    });
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              🔥 Daily Streak
            </h3>
            <p className="text-4xl font-bold text-primary mt-2">
              {currentStreak}
            </p>
            <p className="text-gray-600 text-sm">
              day{currentStreak !== 1 ? "s" : ""}
            </p>
          </div>
          {canCheckinToday ? (
            <div className="text-right">
              <p className="text-amber-600 font-semibold text-sm mb-2">
                Check in today to maintain streak!
              </p>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-xl">⏰</span>
              </div>
            </div>
          ) : (
            <div className="text-right">
              <p className="text-green-600 font-semibold text-sm mb-2">
                Checked in today!
              </p>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Last 7 Days Calendar */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-3 font-semibold">Last 7 Days</p>
        <div className="grid grid-cols-7 gap-3">
          {last7Days.map((dayData, idx) => (
            <div key={idx} className="text-center">
              <p className="text-xs text-gray-600 font-semibold mb-2">
                {dayData.day}
              </p>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  dayData.isCheckedIn
                    ? "bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg"
                    : "bg-gray-200 text-gray-600"
                } ${
                  dayData.isToday ? "ring-2 ring-primary ring-offset-2" : ""
                }`}
              >
                {dayData.isCheckedIn ? "✓" : "·"}
              </div>
              {dayData.isToday && (
                <p className="text-xs text-primary font-bold mt-1">Today</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
        <p className="text-sm text-gray-700">
          <strong>💡 How Streaks Work:</strong> Check in every day to build your
          streak. Miss one day and your streak resets. Daily check-in = +5
          points.
        </p>
      </div>
    </div>
  );
}
