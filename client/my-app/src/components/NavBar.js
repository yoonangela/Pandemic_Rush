import React from "react";
import { NavLink } from "react-router-dom";


function NavBar({ setUser, user }) {
  function handleLogoutClick() {
    fetch("http://127.0.0.1:5555/logout", { method: "DELETE" , credentials: "include"}).then((r) => {
      if (r.ok) {
        setUser(null);
      }
    });
  }

  if (user) {
    return (
      <>
        <nav>
          <button
            id="logout"
            className="button-class logout"
            variant="outline"
            onClick={handleLogoutClick}
          >
            Logout
          </button>
        </nav>
        <nav className="nav-container">
          <NavLink
            to="/"
            className="nav-text">
            New Game
          </NavLink>
        </nav>
        <nav className="nav-container">
          <NavLink
            to="/rank"
            className="nav-text">
            Rank
          </NavLink>
        </nav>
        <nav className="nav-container">
        <NavLink to={`/users/${user.id}/settings`} className="nav-text">

            Settings
          </NavLink>
        </nav>
      </>
    );
  }

  return null;
}

export default NavBar;
