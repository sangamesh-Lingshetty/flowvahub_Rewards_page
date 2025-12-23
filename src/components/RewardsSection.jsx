import React, { useState } from 'react';
import { Gift, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { claimReward, updateUserPoints, addPointHistory } from '../utils/supabaseQueries';

export default function RewardsSection({ userId, rewards, userPoints, claimedRewards, onRewardClaimed }) {
  const [loading, setLoading] = useState(null);

  const handleClaim = async (reward) => {
    if (userPoints < reward.points_required) {
      alert(`You need ${reward.points_required - userPoints} more points!`);
      return;
    }

    setLoading(reward.id);
    try {
      await claimReward(userId, reward.id);
      const newPoints = userPoints - reward.points_required;
      await updateUserPoints(userId, newPoints);
      await addPointHistory(userId, -reward.points_required, 'reward_claim', `Claimed ${reward.name}`);
      
      onRewardClaimed();
    } catch (error) {
      alert('Failed to claim reward: ' + error.message);
    } finally {
      setLoading(null);
    }
  };

  const groupedRewards = {
    gift_card: rewards.filter(r => r.category === 'gift_card'),
    premium: rewards.filter(r => r.category === 'premium'),
    credit: rewards.filter(r => r.category === 'credit'),
    badge: rewards.filter(r => r.category === 'badge'),
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Gift className="w-6 h-6 text-primary" />
          Redeem Rewards
        </h2>
        <p className="text-gray-600 text-sm">Choose from our amazing rewards</p>
      </div>

      {/* Gift Cards */}
      {groupedRewards.gift_card.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-4">Gift Cards</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {groupedRewards.gift_card.map(reward => (
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
        </div>
      )}

      {/* Premium */}
      {groupedRewards.premium.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-4">Premium</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {groupedRewards.premium.map(reward => (
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
        </div>
      )}

      {/* Credits */}
      {groupedRewards.credit.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-4">Credits</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {groupedRewards.credit.map(reward => (
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
        </div>
      )}

      {/* Badges */}
      {groupedRewards.badge.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-4">Badges</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {groupedRewards.badge.map(reward => (
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
        </div>
      )}
    </div>
  );
}

function RewardCard({ reward, userPoints, isClaimed, loading, onClaim }) {
  const canClaim = userPoints >= reward.points_required && !isClaimed;
  const pointsNeeded = reward.points_required - userPoints;

  return (
    <div className="card flex flex-col justify-between">
      <div>
        <h4 className="text-lg font-bold text-gray-800 mb-2">{reward.name}</h4>
        <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
      </div>

      <div>
        <div className="mb-4 p-3 bg-gray-100 rounded-lg">
          <p className="text-2xl font-bold text-primary">{reward.points_required}</p>
          <p className="text-xs text-gray-600">points required</p>
        </div>

        {isClaimed ? (
          <button
            disabled
            className="w-full py-2 bg-green-100 text-green-700 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Claimed
          </button>
        ) : canClaim ? (
          <button
            onClick={onClaim}
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Claiming...
              </>
            ) : (
              <>
                <Gift className="w-5 h-5" />
                Claim Reward
              </>
            )}
          </button>
        ) : (
          <div className="w-full py-2 bg-gray-200 text-gray-600 rounded-lg font-semibold flex items-center justify-center gap-2">
            <Lock className="w-5 h-5" />
            {pointsNeeded} more points
          </div>
        )}
      </div>
    </div>
  );
}