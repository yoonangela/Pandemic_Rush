import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function Settings(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username && !password && !passwordConfirmation) {
      alert("Please provide at least one field to update 🕸️");
      return;
    }

    // Only proceed if password fields match if they are provided
    if (password || passwordConfirmation) {
      if (password !== passwordConfirmation) {
        alert("The passwords have to match 🐸");
        return;
      }
    }

    // Prepare the request body with the fields to update
    const body = {};

    // Include the username in the request only if it was changed
    if (username !== '') {
      body.username = username;
    }

    // Include password change only if passwords are filled in
    if (password) {
      body.password = password;
    }
    if (passwordConfirmation) {
      body.password_confirmation = passwordConfirmation;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5555/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert("Updated your info! 🐢");
      } else {
        const err = await response.json();
        alert(err.error || "Update failed.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("An error occurred.");
    }
  };

  return (
    <>
      <h2 className='update'>Update Settings</h2>

      <div className="form-update">
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input 
            type="text"
            id="username"
            placeholder="Update your username here"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password">Password:</label>
          <input 
            type="password"
            id="password"
            placeholder="Update your password here"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="passwordConfirmation">Confirm Password:</label>
          <input 
            type="password"
            id="passwordConfirmation"
            placeholder="Confirm your new password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />

          <button>
            Save Settings
          </button>
          <h3>hint: only put in username or password if updating them</h3>
        </form>
      </div>
    </>
  );
};
export default Settings