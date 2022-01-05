import React from "react";
import { inject, observer } from "mobx-react";

const Welcome = inject("gameStore")(
  observer(({ gameStore }) => {
      const {newGame, player} = gameStore
    return (
      <div>
        <h1>welcome again!</h1>

        <button onClick={newGame}>New Game</button>
        <button>Join Game</button>
      </div>
    );
  })
);

export default Welcome;
