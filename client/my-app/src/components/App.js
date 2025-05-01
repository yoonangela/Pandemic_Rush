import React, { useEffect, useState } from "react";
import Login from "../pages/Login";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5555/check_session", { credentials: "include" }).then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    });
  }, []);

  return (
    <div className="app">
      <NavBar setUser={setUser} user={user} />
      {!user ? <Login onLogin={setUser} /> : <Outlet context={{ user }} />}
    </div>
  );
}

export default App;