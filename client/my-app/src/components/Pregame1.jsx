import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Pregame1(){
  const [nextClicked, setNextClicked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (nextClicked) {
      navigate("/pregame2"); // Use an absolute path to navigate
    }
  }, [nextClicked, navigate]);

  function handleNext() {
    setNextClicked(true);
  }

  return (
    <div className="pregame-container">
      <h1 className="welcome">🌍 Welcome to Pandemic Rush</h1>
      <p className="description">
        The world is in chaos.<br />A mysterious virus has rapidly spread across the globe, and panic is rising.<br />
        You are the head of a country's emergency response team. <br />Every decision you make could save lives—or cost them.
      </p>
      <div className="mission">
      <p><strong>Your mission?</strong></p>
      <p><em>Contain the outbreak before it spirals out of control.</em></p>
      <p>Don't forget! Each second in real-time equals 1 day in the game.</p> 
      </div>

      <button  onClick={handleNext}>Next</button>
    </div>
  );
}

export default Pregame1;