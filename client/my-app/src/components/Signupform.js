import React, { useState } from "react";

function SignUpForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    fetch("http://127.0.0.1:5555/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
      body: JSON.stringify({
        username,
        password,
        password_confirmation: passwordConfirmation,
      }),
    }).then((r) => {
      setIsLoading(false);
      if (r.ok) {
        r.json().then((user) => onLogin(user));
      } else {
        r.json().then((err) => {
          const safeErrors = err.errors || [err.error] || ["An unknown error occurred"];
          setErrors(safeErrors);
        });
      }
    });
  }

  return (
    <div className="form-container2">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label className="labels2" htmlFor="username">Username</label>
        <input
          className='input1'
          type="text"
          id="username"
          autoComplete="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="labels2" htmlFor="password">Password</label>
        <input
          className='input1'
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <label className="labels2" htmlFor="password_confirmation">Password Confirmation</label>
        <input
          className='input1'
          type="password"
          id="password_confirmation"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          autoComplete="current-password"
        />

        <button className="b" type="submit">
          {isLoading ? "Loading..." : "Sign Up"}
        </button>

        {errors.map((err, index) => (
          <p key={index}>{err}</p>
        ))}
      </form>
    </div>
  );
}

export default SignUpForm;
