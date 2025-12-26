import { useState, useEffect } from "react";
import { Lock, CheckCircle2, Loader2, Zap } from "lucide-react";
import {
  updateUserPoints,
  addPointHistory,
  getAllRewardsWithDetails,
  claimReward,
  isRewardClaimed,
} from "../utils/supabaseQueries";

function RewardCard({ reward, userPoints, isClaimed, loading, onClaim }) {
  const canClaim = userPoints >= reward.points_required && !isClaimed;
  const pointsNeeded = Math.max(0, reward.points_required - userPoints);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-100 overflow-hidden">
      <div className="h-24 bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
        <span className="text-5xl">{reward.icon || "🎁"}</span>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{reward.name}</h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          {reward.description}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-lg font-bold text-primary">
            {reward.points_required.toLocaleString()} pts
          </span>
        </div>

        {/* BUTTON LOGIC - ONLY DEPENDS ON isClaimed */}
        {isClaimed ? (
          // CLAIMED - GREY BUTTON, ALWAYS
          <button
            disabled
            className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <CheckCircle2 className="w-4 h-4" />
            Claimed ✓
          </button>
        ) : canClaim ? (
          // CAN CLAIM - GREEN BUTTON
          <button
            onClick={onClaim}
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Claiming...
              </>
            ) : (
              "Claim Reward"
            )}
          </button>
        ) : (
          // LOCKED - GREY BUTTON
          <button
            disabled
            className="w-full bg-gray-200 text-gray-600 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <Lock className="w-4 h-4" />
            {pointsNeeded.toLocaleString()} pts needed
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState({ filter }) {
  const getEmptyMessage = () => {
    switch (filter) {
      case "unlocked":
        return {
          icon: "🏆",
          title: "No Claimed Rewards Yet",
          description: "Claim your first reward!",
          action: "Earn points and claim rewards",
        };
      case "locked":
        return {
          icon: "🔒",
          title: "No Locked Rewards",
          description: "You can afford all remaining rewards!",
          action: "Keep earning to unlock new rewards",
        };
      case "coming":
        return {
          icon: "⏳",
          title: "Coming Soon",
          description: "Exciting rewards are on the way!",
          action: "Check back later",
        };
      default:
        return {
          icon: "🎁",
          title: "No Rewards Available",
          description: "Check back soon!",
          action: "New rewards coming",
        };
    }
  };

  const { icon, title, description, action } = getEmptyMessage();

  return (
    <div className="text-center py-16">
      <div className="text-7xl mb-6">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 mb-2">{description}</p>
      <p className="text-sm text-gray-500 italic">{action}</p>
    </div>
  );
}

export default function RedeemRewardsTab({
  userId,
  userPoints,
  claimedRewards,
  onRewardClaimed,
}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [rewardsLoading, setRewardsLoading] = useState(true);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      console.log("📥 Fetching rewards from database...");
      setRewardsLoading(true);
      const data = await getAllRewardsWithDetails();
      console.log("✅ Rewards loaded:", data.length);
      setRewards(data);
    } catch (err) {
      console.error("❌ Failed to fetch rewards:", err);
      setRewards([]);
    } finally {
      setRewardsLoading(false);
    }
  };

  // ========== FILTER LOGIC - DEPENDS ONLY ON claimedRewards ==========
  const getFilteredRewards = () => {
    console.log("Tab:", activeFilter, "Claimed:", claimedRewards);

    switch (activeFilter) {
      case "unlocked":
        // ONLY claimed rewards (doesn't matter if user has points)
        return rewards.filter((r) => claimedRewards.includes(r.id));

      case "locked":
        // ONLY unclaimed AND user can't afford
        return rewards.filter(
          (r) => !claimedRewards.includes(r.id) && userPoints < r.points_required
        );

      case "coming":
        return rewards.filter((r) => !r.active);

      default:
        // ALL = everything
        return rewards;
    }
  };

  // ========== COUNT LOGIC ==========
  const allCount = rewards.length;
  const unlockedCount = rewards.filter((r) => claimedRewards.includes(r.id)).length;
  const lockedCount = rewards.filter(
    (r) => !claimedRewards.includes(r.id) && userPoints < r.points_required
  ).length;
  const comingSoonCount = rewards.filter((r) => !r.active).length;

  const filteredRewards = getFilteredRewards();

  const handleClaim = async (reward) => {
    if (userPoints < reward.points_required) {
      alert(`You need ${reward.points_required - userPoints} more points!`);
      return;
    }

    if (claimedRewards.includes(reward.id)) {
      alert("⚠️ Already claimed!");
      return;
    }

    setLoading(reward.id);
    try {
      console.log("🎁 Claiming:", reward.name);

      // Check if already claimed in DB
      const alreadyClaimed = await isRewardClaimed(userId, reward.id);
      if (alreadyClaimed) {
        throw new Error("Already claimed");
      }

      // INSERT into user_rewards
      await claimReward(userId, reward.id);
      console.log("✅ Claimed in DB");

      // UPDATE user points
      const newPoints = userPoints - reward.points_required;
      await updateUserPoints(userId, newPoints);
      console.log("✅ Points deducted:", newPoints);

      // INSERT into point_history
      await addPointHistory(
        userId,
        -reward.points_required,
        "reward_claim",
        `Claimed ${reward.name}`
      );
      console.log("✅ Transaction logged");

      alert(`🎉 You claimed ${reward.name}!`);
      onRewardClaimed(); // REFRESH ALL DATA
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Failed: " + error.message);
    } finally {
      setLoading(null);
    }
  };

  if (rewardsLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <div className="w-1.5 h-8 bg-primary rounded-r-lg"></div>
          Redeem Your Points
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 mb-8 overflow-x-auto pb-4">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeFilter === "all"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            All
            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${activeFilter === "all" ? "bg-primary text-white" : "bg-gray-200 text-gray-600"}`}>
              {allCount}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter("unlocked")}
            className={`px-4 py-2 font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeFilter === "unlocked"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Claimed
            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${activeFilter === "unlocked" ? "bg-primary text-white" : "bg-gray-200 text-gray-600"}`}>
              {unlockedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter("locked")}
            className={`px-4 py-2 font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeFilter === "locked"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Locked
            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${activeFilter === "locked" ? "bg-primary text-white" : "bg-gray-200 text-gray-600"}`}>
              {lockedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter("coming")}
            className={`px-4 py-2 font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeFilter === "coming"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Coming
            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${activeFilter === "coming" ? "bg-primary text-white" : "bg-gray-200 text-gray-600"}`}>
              {comingSoonCount}
            </span>
          </button>
        </div>

        {/* Rewards Grid */}
        {filteredRewards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                userPoints={userPoints}
                isClaimed={claimedRewards.includes(reward.id)}
                loading={loading === reward.id}
                onClaim={() => handleClaim(reward)}
              />
            ))}
          </div>
        ) : (
          <EmptyState filter={activeFilter} />
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">Points</p>
          <p className="text-3xl font-bold text-primary">{userPoints.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">All</p>
          <p className="text-3xl font-bold text-blue-600">{allCount}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">Claimed</p>
          <p className="text-3xl font-bold text-green-600">{unlockedCount}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">Locked</p>
          <p className="text-3xl font-bold text-amber-600">{lockedCount}</p>
        </div>
      </div>
    </div>
  );
}