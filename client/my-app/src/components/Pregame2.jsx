import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Pregame2(){

    const [nextClicked, setNextClicked] = useState(false); 
    const navigate = useNavigate();
  
    useEffect(() => {
      if (nextClicked) {
        navigate("/pregame3"); 
      }
    }, [nextClicked, navigate]); 
  
    function handleNext() {
      setNextClicked(true); 
    }

    return(

     <div className="pregame-container">
      <h2 className="section-title">🎮 How to Play</h2>
      <ul className="instruction-list">
        <li>You'll be presented with critical decisions—called <strong>"Weapons"</strong>.</li>
        <li>Each weapon has a different <strong>Effect</strong> on virus spread.</li>
        <li>Your choices influence real epidemiological outcomes using the SIR model.</li>
        <li>Remember, <strong>High β</strong> means the disease spreads quickly and <strong>High γ</strong> means people recover quickly  </li>
      </ul>

      <h2 className="section-title">🧠 Your Goal</h2>
      <ul className="goal-list">
        <li>Stop the pandemic <strong>as quickly as possible</strong>.</li>
        <li>Keep infections below <strong>50%</strong> of the population.</li>
        <li>Maintain at least <strong>10%</strong> of the population uninfected.</li>
        <li>Make smart, timely choices and balance public morale, science, and resources.</li>
      </ul>

    <button onClick={handleNext}>Next</button>
    </div>
    )
}

export default Pregame2
