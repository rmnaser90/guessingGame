import React from "react";
import { inject, observer } from "mobx-react";

const NewPlayer = inject("gameStore")(
  observer(({ gameStore }) => {
    const { inputs, newPlayer, handleInput } = gameStore;
    const { newPlayerName } = inputs;

    const handleNameInput = function ({target}) {
        handleInput('newPlayerName',target.value)
    }
    return (
      <div className="screen">
        <h1>Guessing Game</h1>
        <h2>please enter your Name</h2>
        <input
          type="text"
          value={newPlayerName}
          onChange={handleNameInput}
        />
        <button onClick={newPlayer}>Start</button>
      </div>
    );
  })
);

export default NewPlayer;
