import { useAuth } from "@/contexts/AuthContext";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import LandingScreen from "./LandingScreen";
import Content from "./Content";

const Home = () => {
  const { user: firebaseUser } = useAuth();
  const { login } = useGoogleLogin();
  console.log(firebaseUser)
  if (!firebaseUser) return <LandingScreen onLogin={login} />;
  return <Content />;
};

export default Home;
