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
import Tabs from "./components/Tabs";
import EarnPointsTab from "./components/EarnPointsTab";
import RedeemRewardsTab from "./components/RedeemRewardsTab";

export default function App() {
  // Auth states
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState("landing");

  // Dashboard states
  const [user, setUser] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [canCheckinToday, setCanCheckinToday] = useState(true);
  const [activeTab, setActiveTab] = useState("earn"); // 'earn' or 'redeem'

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

      let userData = await getUserData(userId).catch(() => null);

      if (!userData) {
        console.log("Creating new user profile...");
        userData = await createUser(userEmail);
      }

      setUser(userData);

      const rewardsData = await getAllRewards();
      setRewards(rewardsData);

      const claimed = await getUserClaimedRewards(userId);
      setClaimedRewards(claimed);

      const hasCheckedIn = await hasCheckedInToday(userId);
      setCanCheckinToday(!hasCheckedIn);

      setError(null);
    } catch (err) {
      console.error("Error:", err);
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
    console.log("Auth successful, waiting for state change...");
  };

  // Loading state
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

  // Dashboard Page - Loading
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

  // Dashboard Page - Error
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

  // Dashboard Page - Success
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
            

            {/* Tabs */}
            <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Tab Content */}
            {activeTab === "earn" ? (
              <EarnPointsTab
                userId={user.id}
                userPoints={user.total_points}
                currentStreak={user.current_streak}
                canCheckinToday={canCheckinToday}
                onCheckinSuccess={handleCheckinSuccess}
              />
            ) : (
              <RedeemRewardsTab
                userId={user.id}
                userPoints={user.total_points}
                claimedRewards={claimedRewards}
                onRewardClaimed={handleRewardClaimed}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
