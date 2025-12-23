import { Zap, Gift } from "lucide-react";

export default function Tabs({ activeTab, onTabChange }) {
  return (
    <div className="flex gap-4 mb-8 border-b border-gray-200">
      <button
        onClick={() => onTabChange("earn")}
        className={`pb-3 px-4 font-semibold flex items-center gap-2 transition-all ${
          activeTab === "earn"
            ? "text-primary border-b-2 border-primary"
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        <Zap className="w-5 h-5" />
        Earn Points
      </button>
      <button
        onClick={() => onTabChange("redeem")}
        className={`pb-3 px-4 font-semibold flex items-center gap-2 transition-all ${
          activeTab === "redeem"
            ? "text-primary border-b-2 border-primary"
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        <Gift className="w-5 h-5" />
        Redeem Rewards
      </button>
    </div>
  );
}
