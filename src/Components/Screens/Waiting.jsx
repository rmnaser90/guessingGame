import React from "react";
import { inject, observer } from "mobx-react";

const Waiting = inject("gameStore")(
  observer(({ gameStore }) => {
    const{pin} = gameStore.gameState
    return (
      <div>
        <h1>waiting</h1>
    <h2>share this PIN with your friend: {pin}</h2>
      </div>
    );
  })
);

export default Waiting;
