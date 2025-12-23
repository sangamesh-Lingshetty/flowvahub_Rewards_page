import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function AuthContainer({ onAuthSuccess }) {
  const [isSignup, setIsSignup] = useState(false);

  return isSignup ? (
    <Signup onSuccess={onAuthSuccess} onToggle={() => setIsSignup(false)} />
  ) : (
    <Login onSuccess={onAuthSuccess} onToggle={() => setIsSignup(true)} />
  );
}
