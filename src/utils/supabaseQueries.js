import { supabase } from "../config/supabaseClient";

export const getUserData = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("getUserData error:", error);
      return null; // Return null instead of throwing
    }
    return data;
  } catch (err) {
    console.error("getUserData catch:", err);
    return null;
  }
};
export const getUserByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.error("getUserByEmail error:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("getUserByEmail catch:", err);
    return null;
  }
};
export const createUser = async (email) => {
  try {
    console.log("Creating user for email:", email);

    // First check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log("User already exists:", existingUser);
      return existingUser;
    }

    // Create new user
    const { data, error } = await supabase
      .from("users")
      .insert([{ email }])
      .select()
      .single();

    if (error) {
      console.error("createUser error:", error);
      throw new Error(error.message);
    }

    console.log("User created successfully:", data);
    return data;
  } catch (err) {
    console.error("createUser catch:", err);
    throw err;
  }
};

export const updateUserPoints = async (userId, points) => {
  const { data, error } = await supabase
    .from("users")
    .update({ total_points: points, updated_at: new Date() })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updateUserStreak = async (userId, streak) => {
  const { data, error } = await supabase
    .from("users")
    .update({ current_streak: streak, updated_at: new Date() })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getAllRewardsWithDetails = async () => {
  try {
    const { data, error } = await supabase
      .from("rewards")
      .select("*")
      .eq("active", true)
      .order("points_required", { ascending: true });

    if (error) {
      console.error("getAllRewardsWithDetails error:", error);
      throw new Error(error.message);
    }

    console.log("Rewards fetched from database:", data);
    return data || [];
  } catch (err) {
    console.error("getAllRewardsWithDetails catch:", err);
    return [];
  }
};

// ===== CHECKIN QUERIES =====
export const hasCheckedInToday = async (userId) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    console.log("Checking if user checked in today:", today);

    const { data, error } = await supabase
      .from("daily_checkins")
      .select("id")
      .eq("user_id", userId)
      .eq("checkin_date", today)
      .single();

    const result = !!data && !error;
    console.log("hasCheckedInToday result:", result);
    return result;
  } catch (err) {
    console.error("hasCheckedInToday error:", err);
    return false;
  }
};

export const createDailyCheckin = async (userId) => {
  const today = new Date().toISOString().split("T")[0];

  try {
    // First check if already checked in today
    const { data: existingCheckin, error: checkError } = await supabase
      .from("daily_checkins")
      .select("id")
      .eq("user_id", userId)
      .eq("checkin_date", today)
      .single();

    // If record exists, return it (don't create duplicate)
    if (existingCheckin && !checkError) {
      console.log("Already checked in today, returning existing record");
      return existingCheckin;
    }

    // If no record exists, create new one
    const { data, error } = await supabase
      .from("daily_checkins")
      .insert([{ user_id: userId, checkin_date: today, points_earned: 5 }])
      .select()
      .single();

    if (error) {
      console.error("createDailyCheckin error:", error);
      throw new Error(error.message);
    }

    console.log("New checkin created:", data);
    return data;
  } catch (err) {
    console.error("createDailyCheckin catch:", err);
    throw err;
  }
};
export const addPointHistory = async (userId, points, source, description) => {
  const { data, error } = await supabase
    .from("point_history")
    .insert([{ user_id: userId, points, source, description }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ===== REWARDS QUERIES =====
export const getAllRewards = async () => {
  const { data, error } = await supabase
    .from("rewards")
    .select("*")
    .eq("active", true)
    .order("points_required", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

export const getRewardById = async (rewardId) => {
  const { data, error } = await supabase
    .from("rewards")
    .select("*")
    .eq("id", rewardId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getUserClaimedRewards = async (userId) => {
  const { data, error } = await supabase
    .from("user_rewards")
    .select("reward_id")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return data.map((item) => item.reward_id);
};

export const claimReward = async (userId, rewardId) => {
  const { data, error } = await supabase
    .from("user_rewards")
    .insert([{ user_id: userId, reward_id: rewardId }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ===== REFERRAL QUERIES =====
export const getUserByReferralCode = async (code) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("referral_code", code)
    .single();

  if (error) return null;
  return data;
};

export const getReferralStats = async (userId) => {
  // This would require additional tracking table for referrals
  // For now, return mock data
  return { referrals: 0, pointsEarned: 0 };
};

// Get user's claimed rewards with details
export const getUserClaimedRewardsWithDetails = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("user_rewards")
      .select(
        `
        id,
        reward_id,
        claimed_at,
        rewards:reward_id (
          id,
          name,
          description,
          points_required,
          icon,
          category
        )
      `
      )
      .eq("user_id", userId)
      .order("claimed_at", { ascending: false });

    if (error) {
      console.error("Error fetching claimed rewards:", error);
      return [];
    }

    console.log("✅ Claimed rewards fetched:", data);
    return data || [];
  } catch (err) {
    console.error("getUserClaimedRewardsWithDetails error:", err);
    return [];
  }
};

export const getUserClaimedRewardIds = async (userId) => {
  try {
    console.log("📥 Fetching claimed reward IDs...");

    const { data, error } = await supabase
      .from("user_rewards")
      .select("reward_id")
      .eq("user_id", userId);

    if (error) {
      console.error("❌ Error:", error);
      return [];
    }

    const ids = data.map((item) => item.reward_id);
    console.log("✅ Claimed IDs from DB:", ids);
    return ids;
  } catch (err) {
    console.error("❌ Error:", err);
    return [];
  }
};

// Check if specific reward is claimed
export const isRewardClaimed = async (userId, rewardId) => {
  try {
    const { data, error } = await supabase
      .from("user_rewards")
      .select("id")
      .eq("user_id", userId)
      .eq("reward_id", rewardId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return !!data;
  } catch (err) {
    console.error("isRewardClaimed error:", err);
    return false;
  }
};

// Get reward details
export const getRewardDetails = async (rewardId) => {
  try {
    const { data, error } = await supabase
      .from("rewards")
      .select("*")
      .eq("id", rewardId)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("getRewardDetails error:", err);
    return null;
  }
};
