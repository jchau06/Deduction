import React from "react";
import "./ModeBar.css";
import cameraImg from "../assets/camera.png";
import musicImg from "../assets/music.png";
import talkImg from "../assets/talk.png";

const ModeBar = ({ onSelectMode }) => {
  const handleButtonClick = (mode) => {
    const input = document.querySelector(`.${mode}-input`);
    const inputValue = input ? input.value : null;
    console.log(inputValue);
    onSelectMode(mode, inputValue);
  };

  return (
    <div className="mode-bar-grid">
      <li>
        <div className="grid-selector">
          <button
            className="button-selector"
            onClick={() => handleButtonClick("quote")}
          >
            Quote Mode
          </button>
          <img src={talkImg} alt="gradient talk image" />
          <p>Deduce which quote is AI-generated or real!</p>
          <input
            className="input-selector quote-input"
            type="number"
            min="1"
            max="10"
            placeholder="0"
          />
        </div>
      </li>
      <li>
        <div className="grid-selector">
          <button
            className="button-selector"
            // onClick={() => handleButtonClick("picture")}
          >
            Picture Mode
          </button>
          <img src={cameraImg} alt="gradient camera image" />
          <p>Deduce which picture is AI-generated or real!</p>
          <input
            className="input-selector picture-input"
            type="number"
            min="1"
            max="10"
            placeholder="0"
          />
        </div>
      </li>
      <li>
        <div className="grid-selector">
          <button
            className="button-selector"
            // onClick={() => handleButtonClick("music")}
          >
            Music Mode
          </button>
          <img src={musicImg} alt="gradient music image" />
          <p id="music-text">Deduce which music is AI-generated or real!</p>
          <input
            className="input-selector music-input"
            type="number"
            min="1"
            max="10"
            placeholder="0"
          />
        </div>
      </li>
    </div>
  );
};

export default ModeBar;
