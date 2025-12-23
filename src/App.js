import { useState, useEffect } from "react";
import { Loader2, AlertCircle, LogOut } from "lucide-react";
import { onAuthStateChange, signOut } from "./config/supabaseClient";
import {
  getUserData,
  createUser,
  getAllRewards,
  getUserClaimedRewards,
  hasCheckedInToday,
} from "./utils/supabaseQueries";
import Landing from "./components/Landing";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import PointsDisplay from "./components/PointsDisplay";
import DailyCheckin from "./components/DailyCheckin";
import RewardsSection from "./components/RewardsSection";
import ReferralSection from "./components/ReferralSection";

export default function App() {
  // Auth states
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState("landing"); // 'landing' | 'login' | 'signup' | 'dashboard'

  // Dashboard states
  const [user, setUser] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [canCheckinToday, setCanCheckinToday] = useState(true);

  // Check auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      console.log("Auth state changed:", user?.email);
      setAuthUser(user);

      if (user) {
        setAuthMode("dashboard");
        initializeApp(user.id, user.email);
      } else {
        setAuthMode("landing");
        setUser(null);
        setRewards([]);
        setClaimedRewards([]);
        setAuthLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const initializeApp = async (userId, userEmail) => {
    try {
      setLoading(true);
      console.log("Initializing app for user:", userId, userEmail);

      // Get or create user profile
      let userData = await getUserData(userId);
      console.log("Got user data:", userData);

      // If no profile, create one
      if (!userData) {
        console.log("No user profile found, creating new one...");
        userData = await createUser(userEmail);
        console.log("New profile created:", userData);
      }

      setUser(userData);

      // Fetch rewards
      const rewardsData = await getAllRewards();
      setRewards(rewardsData);

      // Fetch claimed rewards
      const claimed = await getUserClaimedRewards(userId);
      setClaimedRewards(claimed);

      // Check if checked in today
      const hasCheckedIn = await hasCheckedInToday(userId);
      setCanCheckinToday(!hasCheckedIn);

      setError(null);
      console.log("App initialized successfully!");
    } catch (err) {
      console.error("Error initializing app:", err);
      setError("Failed to load rewards. Please refresh.");
    } finally {
      setLoading(false);
      setAuthLoading(false);
    }
  };

  const handleCheckinSuccess = () => {
    setCanCheckinToday(false);
    if (user) initializeApp(user.id, authUser.email);
  };

  const handleRewardClaimed = () => {
    if (user) initializeApp(user.id, authUser.email);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setAuthUser(null);
      setUser(null);
      setRewards([]);
      setClaimedRewards([]);
      setAuthMode("landing");
    } catch (err) {
      alert("Sign out failed: " + err.message);
    }
  };

  const handleAuthSuccess = () => {
    // Auth state change will be handled by onAuthStateChange listener
    console.log("Auth successful, waiting for state change...");
  };

  // Show loading while checking auth state
  if (authLoading && authMode !== "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Landing Page
  if (authMode === "landing") {
    return (
      <Landing
        onLoginClick={() => setAuthMode("login")}
        onSignupClick={() => setAuthMode("signup")}
      />
    );
  }

  // Login Page
  if (authMode === "login") {
    return (
      <Login
        onSuccess={handleAuthSuccess}
        onToggleSignup={() => setAuthMode("signup")}
      />
    );
  }

  // Signup Page
  if (authMode === "signup") {
    return (
      <Signup
        onSuccess={handleAuthSuccess}
        onToggleLogin={() => setAuthMode("login")}
      />
    );
  }

  // Dashboard Page
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading your rewards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-800 mb-4">{error}</p>
          <button
            onClick={() => initializeApp(authUser.id, authUser.email)}
            className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-lg font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary text-white py-8 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">🎯 Rewards Hub</h1>
            <p className="text-white/80">
              Earn points, unlock rewards, and celebrate your progress!
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80 mb-2">Logged in as:</p>
            <p className="font-semibold mb-4">{authUser?.email}</p>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {user && (
          <>
            <PointsDisplay
              points={user.total_points}
              streak={user.current_streak}
            />

            <DailyCheckin
              userId={user.id}
              userPoints={user.total_points}
              canCheckinToday={canCheckinToday}
              onCheckinSuccess={handleCheckinSuccess}
            />

            <RewardsSection
              userId={user.id}
              rewards={rewards}
              userPoints={user.total_points}
              claimedRewards={claimedRewards}
              onRewardClaimed={handleRewardClaimed}
            />

            <ReferralSection
              userId={user.id}
              referralCode={user.referral_code}
            />
          </>
        )}
      </main>
    </div>
  );
}
