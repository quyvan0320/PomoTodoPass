import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";

const LoginPage = () => {
  const { login } = useGoogleLogin();
  const { user } = useAuth();
  console.log(user)
  if (user) {
    return <div>Xin chào ! ✅</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>PomoTodoPass</h1>
      <button onClick={login}>Đăng nhập bằng Google</button>
    </div>
  );
};

export default LoginPage;
