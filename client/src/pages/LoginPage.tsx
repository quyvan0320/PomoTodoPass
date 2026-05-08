import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";

const LoginPage = () => {
  const { login } = useGoogleLogin();
  const { user } = useAuth();

  if (user) {
    return <div>Xin chào {user.displayName}! ✅</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>PomoTodoPass</h1>
      <button onClick={login}>Đăng nhập bằng Google</button>
    </div>
  );
};

export default LoginPage;
