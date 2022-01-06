import React, { useState } from "react";
import { inject, observer } from "mobx-react";

const Welcome = inject("gameStore")(
  observer(({ gameStore }) => {
    const [showPinInput, setShowPinInput] = useState(false)
    const { newGame, player, inputs, handleInput, joinGame} = gameStore
    const { pin } = inputs
    const handlePinInput = ({ target }) => {
      const { value } = target
      const newPin = value.length > 6 ? pin : value
      handleInput('pin', newPin)
    }
    const closePinInput = () => {
      handleInput('pin', '')
      setShowPinInput(false)
    }
    const joinBtn = async ()=>{
      await joinGame()
      closePinInput()
    }
    return (
      <div>
        <h1>welcome again!</h1>

        <button onClick={newGame}>New Game</button>
        <button onClick={() => setShowPinInput(true)}>Join Game</button>
        {showPinInput ? <div className={'pinInputContainer'}>
          <input type="text" value={pin} onChange={handlePinInput} />
          <button onClick={closePinInput}>close</button>
          <button onClick={joinBtn}>Join</button>
        </div> : null}
      </div>
    );
  })
);

export default Welcome;
