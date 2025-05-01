import { useState } from "react";
import LoginForm from "../components/Loginform";
import SignUpForm from "../components/Signupform";

function Login({ onLogin }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="login-container">
      <h1>Welcome to Pandemic Rush!</h1>

      {showLogin ? (
        <>
          <LoginForm onLogin={onLogin} />
          <p>
            Don't have an account?{" "}
            <button className="button-class" onClick={() => setShowLogin(false)}>
              Sign Up
            </button>
          </p>
        </>
      ) : (
        <>
          <SignUpForm onLogin={onLogin} />
          <p>
            Already have an account?{" "}
            <button className="button-class" onClick={() => setShowLogin(true)}>
              Log In
            </button>
          </p>
        </>
      )}
    </div>
  );
}

export default Login;
