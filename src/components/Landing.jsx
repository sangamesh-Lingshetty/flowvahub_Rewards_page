import { ArrowRight, Zap, Gift, Share2 } from "lucide-react";

export default function Landing({ onLoginClick, onSignupClick }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">🎯 Flowva Rewards</h1>
          <div className="flex gap-3">
            <button
              onClick={onLoginClick}
              className="px-6 py-2 text-white hover:bg-white/20 rounded-lg transition-all"
            >
              Sign In
            </button>
            <button
              onClick={onSignupClick}
              className="px-6 py-2 bg-white text-primary font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Earn Points, Unlock Amazing Rewards
        </h2>
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Join thousands of users earning and redeeming exclusive rewards. Start
          your journey today!
        </p>
        <button
          onClick={onSignupClick}
          className="bg-white text-primary px-8 py-3 rounded-lg font-bold text-lg hover:shadow-2xl transition-all inline-flex items-center gap-2"
        >
          Start Earning Now
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-white border border-white/20">
            <Zap className="w-12 h-12 mb-4 text-yellow-300" />
            <h3 className="text-xl font-bold mb-2">Earn Points Daily</h3>
            <p className="text-white/80">
              Check in daily to earn +5 points. Build streaks and unlock
              bonuses!
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-white border border-white/20">
            <Gift className="w-12 h-12 mb-4 text-pink-300" />
            <h3 className="text-xl font-bold mb-2">Redeem Rewards</h3>
            <p className="text-white/80">
              Convert your points into gift cards, premium features, and
              exclusive badges.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-white border border-white/20">
            <Share2 className="w-12 h-12 mb-4 text-green-300" />
            <h3 className="text-xl font-bold mb-2">Refer & Win</h3>
            <p className="text-white/80">
              Invite friends and earn bonus points. Win 10,000 points for 3
              referrals!
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-12 border border-white/20">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to start earning?
          </h3>
          <p className="text-white/80 mb-8">
            Create your account in seconds and begin your rewards journey
          </p>
          <button
            onClick={onSignupClick}
            className="bg-white text-primary px-8 py-3 rounded-lg font-bold text-lg hover:shadow-2xl transition-all"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-white/5 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-white/60">
          <p>&copy; 2024 Flowva Rewards. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
