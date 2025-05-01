import React from "react";

function ChoiceCard({ choice, onChoiceClick }) {
    return (
        <div className="Choice-container">
        <div className="Choice-card">
          <p className="h3">{choice.description}</p>
          <div className="Choice-effects">
            <p>b effect: {choice.b_effect}</p>
            <p>g effect: {choice.g_effect}</p>
          </div>
          <button onClick={() => onChoiceClick(choice)}>Select</button>
        </div>
      </div>
      
    );
}

export default ChoiceCard;
