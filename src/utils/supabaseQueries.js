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

// ===== CHECKIN QUERIES =====
export const hasCheckedInToday = async (userId) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const { data } = await supabase
      .from("daily_checkins")
      .select("id")
      .eq("user_id", userId)
      .eq("checkin_date", today)
      .single();

    return !!data;
  } catch {
    return false;
  }
};

export const createDailyCheckin = async (userId) => {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("daily_checkins")
    .insert([{ user_id: userId, checkin_date: today, points_earned: 5 }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
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
