import React, { useState } from "react";
import { inject, observer } from "mobx-react";
import logOutIcon from "../../assets/logOutIcon.png"

const Welcome = inject("gameStore")(
  observer(({ gameStore }) => {
    const [showPinInput, setShowPinInput] = useState(false);
    const { newGame, player, inputs, handleInput, joinGame,signIn } = gameStore;
    const { pin } = inputs;
    const handlePinInput = ({ target }) => {
      const { value } = target;
      const newPin = value.length > 6 ? pin : value;
      handleInput("pin", newPin);
    };
    const closePinInput = () => {
      handleInput("pin", "");
      setShowPinInput(false);
    };
    const joinBtn = async () => {
      await joinGame();
      handleInput("pin", "");
    };
    const logOut = ()=>{
      localStorage.clear()
      signIn()
    }
    return (
      <div className="screen welcomScreen">
      <div onClick={logOut} className="logOutBtn"><img src={logOutIcon} className="logOutIcon"/></div>

        <div className="header">
          <h1 className="title">
            Guessing <br />
            <span>Game</span>{" "}
          </h1>
        </div>

        <div className="btnContainer">
          <div className="btn" onClick={newGame}>
            New Game
          </div>
          <div className="btn joinBtn" onClick={() => setShowPinInput(true)}>
            Join Game
          </div>
        </div>
        {showPinInput ? (
          <div className="pinInputContainer">
            <div className="subContainer">
              <div className="closebtn" onClick={closePinInput}>
                X
              </div>
              <div className="header">
                <h1 className="title larger">
                  Join <br />
                  <span className="sec"> a Freind</span>{" "}
                </h1>
              </div>
              <div className="joinFrom">
                <input
                  type="number"
                  className="newPlayerInput"
                  value={pin}
                  placeholder="Enter PIN "
                  onChange={handlePinInput}
                />
                <div className="btn" onClick={joinBtn}>
                  Join
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  })
);

export default Welcome;
