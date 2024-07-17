import { useState } from "react";
import "./ComponentTwo.css";


function FlipCard(props) {
  const [flip, setFlip] = useState(false);
  const { backTitle, backText, front } = props;

  return (
    <div className={`card ${flip ? "flip" : ""}`} onClick={() => setFlip(!flip)}>
      <div className="cardFront">
        
        <img src={front} alt="front of the card" />
      </div>
      <div className="cardBack">
        <h2>{backTitle}</h2>
        <p>{backText}</p>
      </div>
    </div>
  );
}


export default FlipCard;
