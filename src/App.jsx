import React, { useState } from 'react';
import Header from './components/Header';
import ModeBar from './components/ModeBar';
import GameSpace from './components/GameSpace';
require('dotenv').config()

function App() {
  const [gameStateStatus, setGameStateStatus] = useState('inactive'); // Handle all states here

  const handleSelectMode = async (mode, inputValue) => {
    if (inputValue) {
      setGameStateStatus('loading'); // Set the game state to "loading" while waiting

      try {
        // Make the API call to your backend
        const response = await fetch('http://localhost:5001/api/run-extract', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mode, inputValue }),
        });

        const result = await response.json();

        if (response.ok) {
          console.log('API call successful:', result.message);

          // Once API call is successful, fetch the updated quotes
          // Assuming you dynamically update the `quotes.js` file or use another method to fetch quotes
          const updatedQuotes = await import('./scripts/quotes.js');
          console.log('Updated quotes:', updatedQuotes);
        } else {
          console.error('Error from server:', result.error);
        }
      } catch (error) {
        console.error('Error making API call:', error);
      }

      setGameStateStatus('active'); // Change state to "active" after completing the task
      console.log(`Selected mode: ${mode}, Input Value: ${inputValue}`);
    } else {
      setGameStateStatus('inactive-user-error'); // If input is invalid
      console.log(`Please enter your number of deductions for ${mode}.`);
    }
  };

  return (
    <>
      <Header />
      <main id="main-div">
        <ModeBar onSelectMode={handleSelectMode} />
        <GameSpace state={gameStateStatus} setGameState={setGameStateStatus} /> {/* GameSpace handles loading based on the state */}
      </main>
    </>
  );
}

export default App;
