import { useAuth } from "@/contexts/AuthContext";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import React from "react";
import LandingScreen from "./LandingScreen";

const Home = () => {
  const { user: firebaseUser } = useAuth();
  const { login } = useGoogleLogin();

  if (!firebaseUser) return <LandingScreen onLogin={() => {}} />;
  return <div>Home</div>;
};

export default Home;
