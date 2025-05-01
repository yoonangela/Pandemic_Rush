import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";



function Home() {

    const [clicked, setClicked] = useState(false)
    const navigate = useNavigate();


    useEffect(() => {
        if (clicked) {
            navigate("pregame1"); 
        }
    }, [clicked, navigate]); 

    function handleStart() {
        setClicked(!clicked)
      }


    return(
        <>
             <h1 className="Title">Pandemic Rush</h1>
             <button className='gamestart' onClick={handleStart} >Game Start</button>
        </>
    )
}

export default Home;