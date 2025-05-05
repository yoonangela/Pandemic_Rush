import React, { useEffect, useState } from "react";

function MiddleResult({ timer, scenario, simulation, choice, onNext }) {
  const [resultData, setResultData] = useState(null);
  // const daysPassed = timer;
  const population = simulation.population; // make sure this exists in simulation

  useEffect(() => {
    const scenarioChoiceData = {
      simulation_id: simulation.id,
      scenario_id: scenario.id,
      choice_id: choice.id,
      timetaken: timer
    };

    fetch("http://127.0.0.1:5555/simulation_choices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(scenarioChoiceData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to post choice");
        }
        return response.json();
      })
      .then(data => {
        console.log("Choice saved:", data);
        setResultData(data);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }, []);

  if (!resultData) return <div>Loading results...</div>;

  const infectedRatio = resultData.after_I / population;

  if (infectedRatio > 0.5) {
    return (
      <div style={{ color: 'red', textAlign: 'center' }}>
        <h2>💀 Pandemic Out of Control</h2>
        <p>More than 50% of the population is infected.</p>
        <p>You failed to stop the outbreak in time.</p>
        <button onClick={() => window.location.reload()}>Restart Simulation</button>
      </div>
    );
  }

  return (
    <div className='middleresult'>
      <h2 className='middleresult-title'>📊 This is the Results until now.</h2>
      <p><strong>Days Passed:</strong> {resultData.timetaken} days</p>
      <p>
        <strong>Before applying policy</strong><br />
        Susceptible: {Math.round(resultData.before_S)}, Infected: {Math.round(resultData.before_I)}, Recovered: {100000-Math.round(resultData.before_S)-Math.round(resultData.before_I)}
      </p>
      <p>
        <strong>After applying the policy</strong><br />
        Susceptible: {Math.round(resultData.after_S)}, Infected: {Math.round(resultData.after_I)}, Recovered: {100000-Math.round(resultData.after_S)-Math.round(resultData.after_I)}
      </p>
      <button onClick={onNext}>Next Scenario</button>
    </div>
  );
}

export default MiddleResult;
