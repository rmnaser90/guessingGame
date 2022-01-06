import React from "react";
import { inject, observer } from "mobx-react";

const NewPlayer = inject("gameStore")(
  observer(({ gameStore }) => {
    const { inputs, newPlayer, handleInput } = gameStore;
    const { newPlayerName } = inputs;

    const handleNameInput = function ({ target }) {
      handleInput("newPlayerName", target.value);
    };
    return (
      <div className="screen newPlayerScreen">
        <div className="header">
          <h1 className="title">Guessing <br/><span>Game</span> </h1>
        </div>
        <div className="newPlayerForm">
          <input className="newPlayerInput" type="text" placeholder="Enter Your Name" value={newPlayerName} onChange={handleNameInput} />
          <div onClick={newPlayer} className="btn ">Let's Draw & Guess!</div>
        </div>
      </div>
    );
  })
);

export default NewPlayer;
