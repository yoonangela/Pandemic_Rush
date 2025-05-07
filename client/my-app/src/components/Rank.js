import React, {useEffect, useState} from "react";
function Rank(){
  const[result, setResult] = useState([])

  useEffect(() => {
    
      fetch(`http://127.0.0.1:5555/simulation_results`)
        .then((resp) => resp.json())
        .then((data) => {
          setResult(data);
          console.log(result);
        })
        .catch((error) => console.error("Error fetching events:", error));
    
  }, [result]);

  console.log(result)
  console.log(Array.isArray(result));  
  




    return (
        <div className="ranking">
          <h1 className="middleresult-title">🏆 Final Rankings 🏆</h1>
          {result.map((r, index) => (
            <div key={index} className="rank-entry">
              <span className="rank-number">#{index + 1}</span>
              <span className="rank-user">User {r.simulation.user_id}</span>
              <span className="rank-stats"> {Math.round(r.final_I)} infected</span>
            </div>
          ))}
        </div>
      );
      
}

export default Rank