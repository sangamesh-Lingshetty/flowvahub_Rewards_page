import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log("🔧 Supabase Config:");
console.log("URL:", SUPABASE_URL ? "✅ Set" : "❌ Missing");
console.log("Key:", SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing");

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Supabase credentials missing! Check .env file");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth helper functions
export const signUp = async (email, password) => {
  try {
    console.log("📤 Sending signup request to Supabase...");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("❌ Signup error:", error);
      throw new Error(error.message || "Signup failed");
    }

    console.log("✅ Signup response:", data);
    return data;
  } catch (err) {
    console.error("❌ Signup exception:", err);
    throw err;
  }
};

export const signIn = async (email, password) => {
  try {
    console.log("📤 Sending signin request to Supabase...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("❌ Signin error:", error);
      throw new Error(error.message || "Signin failed");
    }

    console.log("✅ Signin response:", data);
    return data;
  } catch (err) {
    console.error("❌ Signin exception:", err);
    throw err;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  return user;
};

export const onAuthStateChange = (callback) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    console.log("🔐 Auth state changed:", event);
    callback(session?.user || null);
  });

  return () => {
    subscription?.unsubscribe();
  };
};
