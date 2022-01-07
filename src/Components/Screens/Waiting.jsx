import React from "react";
import { inject, observer } from "mobx-react";

const Waiting = inject("gameStore")(
  observer(({ gameStore }) => {
    const { pin } = gameStore.gameState;
    const { quitGame } = gameStore
    return (
      <div className="screen waitingScreen">
        <div className="header">
          <h1 className="title larger yellow">
            Waiting <br />
            <span className="sec"> for Friend</span>{" "}
          </h1>
        </div>
        <div className="subContainer">
          <h2 className="waitingText">Share this PIN with your friend: </h2>
          <h1 className="pinNumber">{pin}</h1>
          <div className="btn medium" onClick={quitGame}>cancel</div>

        </div>
      </div>
    );
  })
);

export default Waiting;
