// import React,{useEffect, useState} from "react";
// import Win from "./Win";
// import Lose from "./Lose";


// function Result({simulationid}){
//     const[result, setResult] = useState("")
//     useEffect(() => {
            
//          fetch("http://127.0.0.1:5555/simulation_result", {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({ simulation_id: simulationid }),
//             });
//         }, [simulationid]);

//   useEffect(() => {
   
//       fetch(`http://127.0.0.1:5555/simulation_result/${simulationid}`)
//         .then((resp) => resp.json())
//         .then((data) => {
//           setResult(data);
//           console.log(data);
//         })
//         .catch((error) => console.error("Error fetching events:", error));
    
//   }, [simulationid]);
//   console.log(result)

//     return(
//     <>
//     {result.win ? <Win />:<Lose result={result}/>}
//     </>)
// }

// export default Result

import React, { useEffect, useState } from "react";
import Win from "./Win";
import Lose from "./Lose";

function Result({ simulationid }) {
  const [result, setResult] = useState(null);
  const [hasPosted, setHasPosted] = useState(false);

  useEffect(() => {
    async function postResult() {
      try {
        await fetch("http://127.0.0.1:5555/simulation_result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ simulation_id: simulationid }),
        });
        setHasPosted(true);
      } catch (err) {
        console.error("POST simulation_result failed:", err);
      }
    }
    if (!hasPosted) {
      postResult();
    }
  }, [simulationid, hasPosted]);

  useEffect(() => {
    if (!hasPosted) return;

    async function fetchResult() {
      try {
        const resp = await fetch(
          `http://127.0.0.1:5555/simulation_result/${simulationid}`
        );
        if (!resp.ok) {
          throw new Error(`Server returned ${resp.status}`);
        }
        const data = await resp.json();
        setResult(data);
      } catch (err) {
        console.error("GET simulation_result failed:", err);
      }
    }
    fetchResult();
  }, [simulationid, hasPosted]);

  if (!result) return <div>Loading result…</div>;
  return result.win ? <Win result={result} /> : <Lose result={result} />;
}

export default Result;
