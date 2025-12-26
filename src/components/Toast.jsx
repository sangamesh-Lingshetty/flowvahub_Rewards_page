import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const Icon = type === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-50`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-semibold">{message}</span>
      <button onClick={onClose} className="ml-4">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
