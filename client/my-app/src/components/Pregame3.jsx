import React, { useState, useEffect } from "react";
import ChoiceCard from "./ChoiceCard";
import MiddleResult from "./MiddleResult";
import Result from "./Result";
import { useOutletContext } from "react-router-dom";



function Pregame3() {
  const { user } = useOutletContext();

  const [order, setOrder] = useState(1);
  const [scenario, setScenario] = useState("");
  const [simulation, setSimulation] = useState(null);  // to store simulation data
  const [timer, setTimer] = useState(0);  // to manage the timer
  const [isRunning, setIsRunning] = useState(false);  // flag to check if simulation is running
  const [selectedChoice, setSelectedChoice] = useState(null);

  console.log(user)
  function handleChoiceClick(choice) {
    setSelectedChoice(choice); // show middle result
    }

  function handleNextScenario() {
    setSelectedChoice(null);  
    setOrder((prev) => prev + 1); 
    }


  useEffect(() => {
    const startSimulation = async () => {
        const simulationData = {
            user_id: user.id, //change to the user
            total_population: 100000,
            current_b: 0.056,  // Increase infection rate to make the virus spread faster
            current_g: 0.002, // Decrease recovery rate to make recovery slower
            current_S: 99995, 
            current_I: 5,    
            current_R: 0,     
        };
        

      try {
        const response = await fetch("http://127.0.0.1:5555/simulations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(simulationData),
        });

        const data = await response.json();
        setSimulation(data); 
        setIsRunning(true);  // Start the timer after simulation is created
      } catch (error) {
        console.error("Error starting simulation:", error);
      }
    };

    startSimulation();
  }, []);

  useEffect(() => {
    if (isRunning) {
      fetch(`http://127.0.0.1:5555/scenarios/order/${order}`)
        .then((resp) => resp.json())
        .then((data) => {
          setScenario(data);
          console.log(data);
        })
        .catch((error) => console.error("Error fetching events:", error));
    }
  }, [order, isRunning]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000); // Increment timer every second
    }
    return () => clearInterval(interval);  // Clear the interval when component unmounts or simulation stops
  }, [isRunning]);


  useEffect(() => {
    // once we've fetched (or refetched) a scenario and there's no description,
    // that means we've gone past the last one.
    if (simulation && scenario && !scenario.description) {
      // mark simulation as done
      fetch(`http://127.0.0.1:5555/simulations/${simulation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "done" }),
      })
      .then(() => {
        // optionally update local simulation.status so render knows we're done
        setSimulation(sim => ({ ...sim, status: "done" }));
      })
      .catch(console.error);
    }
  }, [scenario, simulation]);


  if (simulation?.status === "done") {
    return <Result simulationid={simulation.id} />;
  }


  if (selectedChoice) {
    return (
        <MiddleResult
            choice={selectedChoice}
            onNext={handleNextScenario}
            simulation = {simulation}
            scenario = {scenario}
            timer = {timer}
        />
    );
}

const choicelist = scenario && scenario.choices ? (
    scenario.choices.map((choice) => (
        <ChoiceCard key={choice.id} choice={choice} onChoiceClick={handleChoiceClick} />
    ))
) : null;



return (
  <>
    
    {scenario ? <p className='scenario'>{scenario.description}</p> : ""}
    <div className="choice-container">
      {choicelist}
    </div>
    <div>
      <h2 className='timer'>Simulation Timer: {timer}s</h2>
    </div>
  </>
);

}

export default Pregame3;
