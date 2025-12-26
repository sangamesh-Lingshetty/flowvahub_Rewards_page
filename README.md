# 🎯 Flowva Rewards Hub

A beautiful, working rewards system where users earn points daily and claim exciting rewards. Built with React and Supabase.

**Live App:** https://flowvahub-rewards-page.vercel.app/  
**GitHub Code:** https://github.com/sangamesh-Lingshetty/flowva-rewards-hub

---

## ✨ What This App Does

- **Sign Up & Login** - Create an account with email and password
- **Earn Points** - Check in every day to earn +5 points
- **Track Streaks** - See your daily check-in calendar and current streak
- **Claim Rewards** - Use your points to claim exciting rewards
- **View Status** - See claimed rewards separately from available ones

---

## 🚀 Quick Setup (5 Minutes)

### 1. Get the Code
```bash
git clone https://github.com/sangamesh-Lingshetty/flowva-rewards-hub
cd flowva-rewards-hub
npm install
```

### 2. Add Your Supabase Keys
Create a file named `.env.local` in the project root:
```
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

Get these from your Supabase project → Settings → API

### 3. Setup Database
Go to Supabase → SQL Editor and run this:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  total_points INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create rewards table
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  points_required INT NOT NULL,
  icon TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create daily check-ins
CREATE TABLE daily_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  checkin_date DATE NOT NULL,
  points_earned INT DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create claimed rewards
CREATE TABLE user_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  reward_id UUID REFERENCES rewards(id),
  claimed_at TIMESTAMP DEFAULT NOW()
);

-- Create point history
CREATE TABLE point_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  points INT,
  source TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add sample rewards
INSERT INTO rewards (name, description, points_required, icon, active) VALUES
  ('$5 PayPal', 'Get $5 credit on PayPal', 5000, '💰', true),
  ('$5 Amazon Card', 'Get $5 Amazon gift card', 5000, '📦', true),
  ('1 Month Premium', 'Get 1 month premium access', 3000, '⭐', true),
  ('Exclusive Badge', 'Unlock special badge on profile', 300, '🏆', true);

-- Turn off security (for testing only)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE rewards DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards DISABLE ROW LEVEL SECURITY;
ALTER TABLE point_history DISABLE ROW LEVEL SECURITY;
```

### 4. Run the App
```bash
npm start
```
App opens at http://localhost:3000

---

## 📱 How to Use

### Signing Up
1. Click "Get Started" on the home page
2. Enter your email and password
3. You'll see the rewards dashboard with 0 points

### Earning Points
1. Go to "Earn Points" tab
2. Click the "Check In Now" button (you get +5 points)
3. Button becomes "Claimed Today" until tomorrow
4. See your points and streak update instantly

### Claiming Rewards
1. Go to "Redeem Rewards" tab
2. Browse all available rewards
3. Click "Claim Reward" if you have enough points
4. Points get deducted, button becomes "Claimed ✓"
5. View claimed rewards in the "Claimed" tab

---

## 📁 How the Code Works

```
src/
├── App.js                    ← Main app that manages everything
├── components/
│   ├── Landing.jsx           ← Home page
│   ├── Auth/
│   │   ├── Login.jsx         ← Login form
│   │   └── Signup.jsx        ← Signup form
│   ├── EarnPointsTab.jsx     ← Check-in & streak page
│   ├── RedeemRewardsTab.jsx  ← Rewards page
│   ├── Tabs.jsx              ← Tab switching
│   └── Toast.jsx             ← Success messages
├── config/
│   └── supabaseClient.js     ← Connects to Supabase
└── utils/
    └── supabaseQueries.js    ← All database operations
```

---

## 🔄 How Points & Rewards Work

### Earning Points
- You get **+5 points per day** when you check in
- Check-in is one-time per day (automatic reset at midnight)
- Your streak counter increases each day
- If you miss a day, streak resets to 0

### Claiming Rewards
- You can **claim a reward only if**:
  - You have enough points
  - You haven't claimed it before
- When you claim:
  - Points are **permanently deducted** (no refund)
  - Reward moves to "Claimed" section
  - Reward can never be claimed again
- **Claimed rewards stay claimed forever** - even if you earn more points later

### Three Reward Tabs
- **All** - Shows every reward in the system
- **Claimed** - Shows rewards you've already claimed (button disabled)
- **Locked** - Shows rewards you can't afford yet (shows "X more points needed")

---

## 🔐 Security

- Your password is stored safely in Supabase Auth
- Each user can only see their own data
- Points are tracked in database so they never get lost
- Database prevents claiming the same reward twice

---

## 📊 What's In The Database

**Users:** Email, total points, daily streak

**Rewards:** Name, description, points needed, emoji icon

**Daily Checkins:** Date you checked in, points earned

**Claimed Rewards:** Which rewards you've claimed and when

**Point History:** Log of all point changes (check-ins, claims)

---

## ✅ Features Implemented

✅ Sign up with email/password  
✅ Log in securely  
✅ Daily check-in for +5 points  
✅ 7-day calendar showing check-in history  
✅ Streak counter  
✅ Browse all rewards  
✅ See if reward is affordable  
✅ Claim reward with one click  
✅ Points deduct automatically  
✅ View claimed rewards separately  
✅ Data persists after refresh  
✅ Works on phone and desktop  
✅ Success messages (toasts)  
✅ Error messages if something fails  

---

## 🎯 What I Made This For

This was built as a technical assessment for Flowva to show:

1. **React Skills** - Components, hooks, state management
2. **Database Design** - Proper schema with relationships
3. **Authentication** - Secure login/signup system
4. **Real Business Logic** - Points system, claims, rewards
5. **Clean Code** - Easy to understand, no mess
6. **Deployment** - Works live on the internet
7. **UX Design** - Beautiful, works on all devices

---

## 🤔 Things I Could Add Later

- Email confirmations
- Admin dashboard to add rewards
- Referral system (invite friends, earn bonus points)
- Leaderboard (top earners)
- Notifications
- More payment methods for rewards

---

## 🚀 Deploying Your Own Copy

### On Vercel (Free, Easy)
```bash
npm install -g vercel
vercel
# Follow the questions, connect your GitHub repo
```

### On Other Platforms
- Use `npm run build` to create production files
- Deploy the `build/` folder to any hosting service
- Remember to set environment variables on your host

---

## 💡 Troubleshooting

**"Can't log in"**
- Check that your Supabase URL and key are correct
- Make sure database tables exist

**"Points don't save"**
- Check browser console for errors (F12)
- Make sure you're connected to internet
- Try refreshing the page

**"Rewards show incorrectly"**
- Refresh the page
- Clear browser cache (Ctrl+Shift+Delete)

**"Can't claim reward"**
- Do you have enough points?
- Have you already claimed it?
- Check the error message that appears

---

## 📧 Questions?

Email me: sangameshlingshetty@gmail.com  
Phone: 7619587629

---

## 📄 License

Made for Flowva technical assessment.

---

**Made with ❤️ by Sangamesh**
