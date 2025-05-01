import React, { useState } from "react";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

     
  function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    fetch("http://127.0.0.1:5555/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    }).then((r) => {
      setIsLoading(false);
      if (r.ok) {
        r.json().then((user) => onLogin(user));
      } else {
        r.json().then((err) => {
          const safeErrors = err.errors || [err.error] || ["Login failed"];
          setErrors(safeErrors);
        });
      }
    });
  }

  return (
    <div className="form-log">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label className="labels" htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          autoComplete="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="labels" htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button >
          {isLoading ? "Loading..." : "Login"}
        </button>

        {errors.map((err, index) => (
          <p key={index}>{err}</p>
        ))}
      </form>
    </div>
  );
}

export default LoginForm;
