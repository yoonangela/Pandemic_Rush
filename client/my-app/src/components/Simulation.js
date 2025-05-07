import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function Simulation() {
  const [population, setPopulation] = useState(100000);
  const [initialInfected, setInitialInfected] = useState(1);
  const [beta, setBeta] = useState(0.3);   
  const [gamma, setGamma] = useState(0.1); 
  const [data, setData] = useState([]);
  const [policies, setPolicies] = useState([]);

  function runSimulation() {
    let I = initialInfected;
    let S = population - I;
    let R = 0;
    const N = population;
    const result = [];

    let currentBeta = beta;
    let currentGamma = gamma;

    for (let t = 0; t <= 100; t++) {
      policies.forEach(policy => {
        if (policy.day === t) {
          if (policy.type === "mask") currentBeta *= 0.85;
          if (policy.type === "distancing") currentBeta *= 0.7;
          if (policy.type === "vaccination") currentGamma *= 1.3;
        }
      });

      result.push({ day: t, Susceptible: S, Infected: I, Recovered: R });

      const newInfected = currentBeta * S * I / N;
      const newRecovered = currentGamma * I;
      S = Math.max(S - newInfected, 0);
      I = Math.max(I + newInfected - newRecovered, 0);
      R = Math.min(R + newRecovered, N);
    }

    setData(result);
  }

  function handleAddPolicy() {
    const type = document.getElementById("policyType").value;
    const day = parseInt(document.getElementById("policyDay").value);
    if (day >= 0 && day <= 100) {
      setPolicies([...policies, { type, day }]);
    } else {
      alert("Please choose a valid day (0–100)");
    }
  }

  function handleDeletePolicy(index) {
    const updated = [...policies];
    updated.splice(index, 1);
    setPolicies(updated);
  }

  return (
    <>
        <div className="simulation-box">
        <h1 className="simulation">Interactive SIR Simulation</h1>
        </div>
        
        <div className="simulation-box1">

      <div style={{ textAlign: "center", margin: "20px" }}>
        <label>
          Population:
          <input type="number" value={population} onChange={(e) => setPopulation(Number(e.target.value))} />
        </label>
        <label style={{ marginLeft: "20px" }}>
          Initial Infected:
          <input type="number" value={initialInfected} onChange={(e) => setInitialInfected(Number(e.target.value))} />
        </label>
        <label style={{ marginLeft: "20px" }}>
          β (Infection rate):
          <input type="number" step="0.01" value={beta} onChange={(e) => setBeta(Number(e.target.value))} />
        </label>
        <label style={{ marginLeft: "20px" }}>
          γ (Recovery rate):
          <input type="number" step="0.01" value={gamma} onChange={(e) => setGamma(Number(e.target.value))} />
        </label>
        <button onClick={runSimulation} style={{ marginLeft: "20px" }}>Run</button>
      </div>
      </div>


      <div className="policy-1">
        <label>
          Policy:     
          <select id="policyType">
            <option value="mask">Mask Mandate</option>
            <option value="distancing">Social Distancing</option>
            <option value="vaccination">Vaccination</option>
          </select>
        </label>
        <label style={{ marginLeft: "10px" }}>
          Apply on day: 
          <input type="number" id="policyDay" min="0" max="100" defaultValue="10" />
        </label>
        <button
          style={{ marginLeft: "10px" }}
          onClick={handleAddPolicy}
        >
          Add Policy
        </button>
      </div>

      {policies.length > 0 && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <strong>Applied Policies:</strong>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {policies.map((p, i) => (
              <li key={i}>
              📌 Day {p.day}: {p.type}
              <button className="simulationbut delete" onClick={() => handleDeletePolicy(i)}>X</button>
            </li>
            ))}
          </ul>
          <button className = 'simulationbut'
            onClick={() => {
              setPolicies([]);
              setData([]);
            }}
          
          >
            Reset All Policies
          </button>
        </div>
      )}
    
      <div style={{ backgroundColor: "#F5CAC3", padding: "20px", borderRadius: "12px" , margin: "0 auto", width: "1100px" }}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="day" label={{ value: "Days", position: "insideBottom", offset: -10 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Susceptible" stroke="#8884d8" />
          <Line type="monotone" dataKey="Infected" stroke="#ff0000" />
          <Line type="monotone" dataKey="Recovered" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>

    </>
  );
}

export default Simulation;
